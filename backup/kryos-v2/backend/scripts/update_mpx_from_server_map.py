from __future__ import annotations

import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import mysql.connector

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.config import get_settings  # noqa: E402
from app.main import (  # noqa: E402
  compute_address_in,
  load_device_code_from_model,
  load_model_metadata,
  normalize_modbus_code,
  resolve_device_image,
  resolve_model_path,
)

TARGET_UNITS = {3, 4, 8, 9}
MODEL_FILE = 'mpxpro_modbus_amp_trocador.xml'
DEFAULT_DASHBOARD_CODES = ['Po1', 'Po2', 'Po3', 'Po4', 'airoff']


def parse_database_url(database_url: str) -> dict[str, str | int]:
  parsed = urlparse(database_url)
  scheme = (parsed.scheme or '').lower()
  if scheme.startswith('mysql+'):
    scheme = scheme.split('+', 1)[0]
  if scheme != 'mysql':
    raise ValueError('DATABASE_URL deve usar scheme mysql://')
  if not parsed.hostname or not parsed.path:
    raise ValueError('DATABASE_URL invalido')
  return {
    'host': parsed.hostname,
    'port': parsed.port or 3305,
    'user': parsed.username or '',
    'password': parsed.password or '',
    'database': parsed.path.lstrip('/'),
  }


def parse_server_map_variables(
  server_path: str,
  model_metadata: dict[str, dict[str, object]],
) -> dict[int, list[dict[str, object]]]:
  root = ET.parse(server_path).getroot()
  if (root.tag or '').lower() != 'mbs_configuration':
    raise ValueError('Server map invalido')
  variables_by_unit: dict[int, list[dict[str, object]]] = {}
  for device_node in root.findall('.//device'):
    addr_raw = device_node.attrib.get('addr')
    try:
      unit_id = int(addr_raw)
    except (TypeError, ValueError):
      continue
    if unit_id not in TARGET_UNITS:
      continue
    variables: list[dict[str, object]] = []
    for node in list(device_node):
      tag = (node.tag or '').lower()
      if tag not in ('reg', 'coil'):
        continue
      code = (node.attrib.get('code') or '').strip()
      normalized = normalize_modbus_code(code)
      if not normalized:
        continue
      addr = node.attrib.get('addr')
      try:
        offset = int(addr)
      except (TypeError, ValueError):
        continue
      function_code = 4 if tag == 'reg' else 1
      meta = model_metadata.get(normalized, {})
      length = int(meta.get('length') or 1)
      variables.append({
        'code': code,
        'label': meta.get('label') or code,
        'function_code': function_code,
        'offset': offset,
        'length': length,
        'address_in': compute_address_in(function_code, offset),
        'measure_unit': meta.get('measure_unit'),
        'decimals': meta.get('decimals'),
      })
    variables_by_unit[unit_id] = variables
  return variables_by_unit


def fetch_dashboard_codes(conn: mysql.connector.MySQLConnection, device_id: int) -> list[str]:
  cur = conn.cursor()
  cur.execute(
    (
      'SELECT v.code '
      'FROM device_dashboard_variables dv '
      'JOIN device_variables v ON v.id = dv.variable_id '
      'WHERE dv.device_id = %s '
      'ORDER BY dv.display_order ASC, dv.id ASC'
    ),
    (device_id,),
  )
  rows = cur.fetchall()
  cur.close()
  return [row[0] for row in rows]


def delete_device_data(conn: mysql.connector.MySQLConnection, device_id: int) -> None:
  cur = conn.cursor()
  cur.execute('DELETE FROM device_dashboard_variables WHERE device_id = %s', (device_id,))
  cur.execute('DELETE FROM device_variables WHERE device_id = %s', (device_id,))
  conn.commit()
  cur.close()


def insert_device_variables(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  variables: list[dict[str, object]],
) -> int:
  rows: list[tuple[object, ...]] = []
  for variable in variables:
    rows.append((
      device_id,
      variable.get('code'),
      variable.get('label'),
      variable.get('function_code'),
      variable.get('offset'),
      variable.get('length'),
      variable.get('address_in'),
      variable.get('measure_unit'),
      variable.get('decimals'),
    ))
  if not rows:
    return 0
  cur = conn.cursor()
  cur.executemany(
    (
      'INSERT INTO device_variables '
      '(device_id, code, label, function_code, offset, length, address_in, measure_unit, decimals) '
      'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
    ),
    rows,
  )
  conn.commit()
  cur.close()
  return len(rows)


def set_dashboard_variables(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  codes: list[str],
) -> int:
  if not codes:
    return 0
  cur = conn.cursor()
  placeholders = ','.join(['%s'] * len(codes))
  cur.execute(
    f'SELECT id, code FROM device_variables WHERE device_id = %s AND code IN ({placeholders})',
    [device_id, *codes],
  )
  rows = cur.fetchall()
  id_by_code = {row[1]: row[0] for row in rows}
  cur.execute('DELETE FROM device_dashboard_variables WHERE device_id = %s', (device_id,))
  insert_rows = [
    (device_id, id_by_code[code], idx)
    for idx, code in enumerate(codes)
    if code in id_by_code
  ]
  if insert_rows:
    cur.executemany(
      'INSERT INTO device_dashboard_variables (device_id, variable_id, display_order) VALUES (%s, %s, %s)',
      insert_rows,
    )
  conn.commit()
  cur.close()
  return len(insert_rows)


def upsert_device_asset(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  model_file: str,
  device_code: str | None,
) -> None:
  image_key, image_path = resolve_device_image(model_file, device_code)
  cur = conn.cursor()
  cur.execute('DELETE FROM device_assets WHERE device_id = %s', (device_id,))
  cur.execute(
    'INSERT INTO device_assets (device_id, model_file, image_key, image_path) VALUES (%s, %s, %s, %s)',
    (device_id, model_file, image_key, image_path),
  )
  conn.commit()
  cur.close()


def main() -> None:
  settings = get_settings()
  server_file = (settings.modbus_server_map_file or '').strip()
  if not server_file:
    raise SystemExit('MODBUS_SERVER_MAP_FILE vazio')
  resolve_model_path(MODEL_FILE)
  server_path = resolve_model_path(server_file)
  model_metadata = load_model_metadata(MODEL_FILE)
  device_vars_by_unit = parse_server_map_variables(server_path, model_metadata)

  db_url = settings.database_url
  cfg = parse_database_url(db_url)
  try:
    conn = mysql.connector.connect(**cfg)
  except mysql.connector.Error as exc:  # noqa: PERF203
    raise SystemExit(f'Falha ao conectar no MySQL: {exc}') from exc

  cur = conn.cursor(dictionary=True)
  cur.execute('SELECT id, modbus_id FROM devices WHERE modbus_id IN (3, 4, 8, 9)')
  devices = cur.fetchall()
  cur.close()

  device_code = load_device_code_from_model(MODEL_FILE)
  updated: list[int] = []
  for device in devices:
    device_id = int(device['id'])
    unit_id = int(device['modbus_id'])
    variables = device_vars_by_unit.get(unit_id, [])
    dashboard_codes = fetch_dashboard_codes(conn, device_id)
    delete_device_data(conn, device_id)
    inserted = insert_device_variables(conn, device_id, variables)
    cur = conn.cursor()
    cur.execute(
      'UPDATE devices SET model_file = %s, device_code = %s, family_code = %s WHERE id = %s',
      (MODEL_FILE, device_code, device_code, device_id),
    )
    conn.commit()
    cur.close()
    if not dashboard_codes:
      dashboard_codes = list(DEFAULT_DASHBOARD_CODES)
    set_dashboard_variables(conn, device_id, dashboard_codes)
    upsert_device_asset(conn, device_id, MODEL_FILE, device_code)
    updated.append(unit_id)
    print(f'Device {device_id} (unit {unit_id}): vars={inserted}, dashboard={len(dashboard_codes)}')

  conn.close()
  print(f'OK. Updated units: {sorted(updated)}')


if __name__ == '__main__':
  main()
