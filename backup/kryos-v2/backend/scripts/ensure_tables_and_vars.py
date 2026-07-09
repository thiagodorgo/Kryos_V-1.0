from __future__ import annotations

import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import mysql.connector

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

DEFAULT_URL = 'mysql+mysqlconnector://root:root@localhost:3305/kryos'


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


def resolve_model_path(model_file: str) -> Path:
  models_dir = ROOT / 'Models'
  target = model_file.strip().lower()
  for entry in models_dir.iterdir():
    if entry.is_file() and entry.name.lower() == target:
      return entry
  raise FileNotFoundError(f'Modelo XML nao encontrado: {model_file}')


def parse_var_metadata(model_path: Path) -> dict[str, dict[str, object]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  metadata: dict[str, dict[str, object]] = {}
  for var_node in root.findall('.//Vars/Var'):
    code = var_node.attrib.get('code')
    if not code:
      continue
    measure_unit = var_node.attrib.get('um')
    decimals_raw = var_node.attrib.get('dp')
    decimals = int(decimals_raw) if decimals_raw and decimals_raw.isdigit() else None
    metadata[code] = {'measure_unit': measure_unit, 'decimals': decimals}
  return metadata


def parse_var_descriptions(model_path: Path) -> dict[str, str]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  descriptions: dict[str, str] = {}
  for item in root.findall('.//Translations/Langs/Lang/Sections/Section/Items/Item'):
    code = item.attrib.get('code')
    if not code:
      continue
    descr_key = item.find('.//Key[@key="descr"]')
    descr = descr_key.attrib.get('value') if descr_key is not None else None
    if descr:
      descriptions[code] = descr
  return descriptions


def address_to_offset(address_in: str) -> int | None:
  if not address_in:
    return None
  try:
    raw = int(str(address_in))
  except ValueError:
    return None
  if raw <= 0:
    return None
  base = raw % 100000
  return max(0, base - 1)


def resolve_length(function_code: int, fallback: int) -> int:
  return max(1, fallback)


def parse_modbus_map(model_path: Path) -> list[dict[str, object]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  modbus_vars = root.find('.//Protos/Modbus/Vars')
  carel_vars = root.find('.//Protos/Carel/Vars')
  if modbus_vars is None and carel_vars is None:
    return []
  var_meta = parse_var_metadata(model_path)
  entries: dict[tuple[int, int, int], dict[str, object]] = {}
  def add_entry(func_type: int, address_in: str, var_node: ET.Element) -> None:
    offset = address_to_offset(address_in)
    if offset is None or func_type <= 0:
      return
    var_dimension = int(var_node.attrib.get('varDimension', '0') or 0)
    var_length = int(var_node.attrib.get('varLength', '0') or 0)
    length = 1
    if func_type in (3, 4) and max(var_dimension, var_length) > 16:
      length = 2
    length = resolve_length(func_type, length)
    key = (func_type, offset, length)
    entry = entries.get(key)
    code = var_node.attrib.get('code')
    meta = var_meta.get(code or '', {})
    if entry is None:
      entries[key] = {
        'function_code': func_type,
        'offset': offset,
        'length': length,
        'address_in': address_in,
        'codes': [code],
        'measure_unit': meta.get('measure_unit'),
        'decimals': meta.get('decimals'),
      }
    else:
      entry_codes = entry.get('codes', [])
      if isinstance(entry_codes, list):
        entry_codes.append(code)
  if modbus_vars is not None:
    for var_node in modbus_vars.findall('VarMDB'):
      func_type = int(var_node.attrib.get('funcTypeRead', '0') or 0)
      address_in = var_node.attrib.get('addressIn', '') or ''
      add_entry(func_type, address_in, var_node)
    for var_node in modbus_vars.findall('VarCRL'):
      address_in = var_node.attrib.get('addressIn', '') or ''
      add_entry(3, address_in, var_node)
  if carel_vars is not None:
    for var_node in carel_vars.findall('VarCRL'):
      address_in = var_node.attrib.get('addressIn', '') or ''
      add_entry(3, address_in, var_node)
  return list(entries.values())


def ensure_aux_tables(conn: mysql.connector.MySQLConnection) -> None:
  stmts = [
    """CREATE TABLE IF NOT EXISTS device_dashboard_variables (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      device_id BIGINT NOT NULL,
      variable_id BIGINT NOT NULL,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
      FOREIGN KEY (variable_id) REFERENCES device_variables(id) ON DELETE CASCADE
    )""",
    "CREATE INDEX idx_dashboard_variables_device ON device_dashboard_variables (device_id)",
    """CREATE TABLE IF NOT EXISTS device_assets (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      device_id BIGINT NOT NULL,
      model_file VARCHAR(200),
      image_key VARCHAR(120),
      image_path VARCHAR(200),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
    )""",
    "CREATE INDEX idx_device_assets_device ON device_assets (device_id)",
  ]
  cur = conn.cursor()
  for stmt in stmts:
    try:
      cur.execute(stmt)
    except mysql.connector.Error as exc:  # noqa: PERF203
      if exc.errno == 1061:  # duplicate index
        continue
      raise
  conn.commit()
  cur.close()


def get_devices(conn: mysql.connector.MySQLConnection) -> list[dict[str, str | int | None]]:
  cur = conn.cursor(dictionary=True)
  cur.execute('SELECT id, model_file FROM devices')
  rows = cur.fetchall()
  cur.close()
  return rows


def get_existing_codes(conn: mysql.connector.MySQLConnection, device_id: int) -> set[str]:
  cur = conn.cursor()
  cur.execute('SELECT code FROM device_variables WHERE device_id = %s', (device_id,))
  codes = {row[0] for row in cur.fetchall()}
  cur.close()
  return codes


def insert_device_variables_for_model(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  model_file: str,
) -> int:
  model_path = resolve_model_path(model_file)
  entries = parse_modbus_map(model_path)
  descriptions = parse_var_descriptions(model_path)
  existing = get_existing_codes(conn, device_id)

  rows_to_insert: list[tuple[object, ...]] = []
  for entry in entries:
    for code in entry.get('codes', []) or []:
      if not code or code in existing:
        continue
      label = descriptions.get(code, code)
      rows_to_insert.append((
        device_id,
        code,
        label,
        entry.get('function_code'),
        entry.get('offset'),
        entry.get('length'),
        entry.get('address_in'),
        entry.get('measure_unit'),
        entry.get('decimals'),
      ))

  if not rows_to_insert:
    return 0

  cur = conn.cursor()
  cur.executemany(
    (
      'INSERT INTO device_variables '
      '(device_id, code, label, function_code, offset, length, address_in, measure_unit, decimals) '
      'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
    ),
    rows_to_insert,
  )
  conn.commit()
  cur.close()
  return len(rows_to_insert)


def ensure_dashboard_defaults(conn: mysql.connector.MySQLConnection, device_id: int) -> int:
  cur = conn.cursor()
  cur.execute('SELECT 1 FROM device_dashboard_variables WHERE device_id = %s LIMIT 1', (device_id,))
  if cur.fetchone():
    cur.close()
    return 0
  cur.execute('SELECT id FROM device_variables WHERE device_id = %s ORDER BY id ASC LIMIT 5', (device_id,))
  vars_rows = cur.fetchall()
  if not vars_rows:
    cur.close()
    return 0
  rows = [(device_id, var_id, idx) for idx, (var_id,) in enumerate(vars_rows)]
  cur.executemany(
    'INSERT INTO device_dashboard_variables (device_id, variable_id, display_order) VALUES (%s, %s, %s)',
    rows,
  )
  conn.commit()
  cur.close()
  return len(rows)


def main() -> None:
  db_url = os.getenv('DATABASE_URL', DEFAULT_URL)
  cfg = parse_database_url(db_url)
  conn = mysql.connector.connect(**cfg)
  ensure_aux_tables(conn)

  devices = get_devices(conn)
  total_vars = 0
  total_dash = 0
  for device in devices:
    device_id = int(device['id'])
    model_file = device.get('model_file')
    if not model_file:
      continue
    try:
      inserted = insert_device_variables_for_model(conn, device_id, str(model_file))
      total_vars += inserted
      total_dash += ensure_dashboard_defaults(conn, device_id)
      print(f'Device {device_id} ({model_file}): +{inserted} variaveis, dashboard +{total_dash}')
    except FileNotFoundError as exc:
      print(f'Pulado device {device_id}: {exc}')
      continue

  conn.close()
  print(f'OK. Devices: {len(devices)}, variaveis novas: {total_vars}, dashboard seeds: {total_dash}')


if __name__ == '__main__':
  main()
