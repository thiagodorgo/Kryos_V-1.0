from __future__ import annotations

import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import mysql.connector

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_URL = 'mysql+mysqlconnector://root:root@localhost:3305/kryos'
DEFAULT_SERVER_MAP = 'panifresh_modbus_server_20260106224146.xml'


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


def normalize_code(code: str | None) -> str | None:
  if not code:
    return None
  return code.strip().lower()


def parse_server_modbus_map(model_path: Path) -> dict[int, dict[str, dict[str, object]]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  mapping: dict[int, dict[str, dict[str, object]]] = {}
  for device_node in root.findall('.//device'):
    addr_raw = device_node.attrib.get('addr')
    try:
      unit_id = int(addr_raw)
    except (TypeError, ValueError):
      continue
    device_map = mapping.setdefault(unit_id, {})
    for node in list(device_node):
      tag = (node.tag or '').lower()
      if tag not in ('reg', 'coil'):
        continue
      code = (node.attrib.get('code') or '').strip()
      normalized = normalize_code(code)
      if not normalized:
        continue
      addr = node.attrib.get('addr')
      try:
        offset = int(addr)
      except (TypeError, ValueError):
        continue
      function_code = 4 if tag == 'reg' else 1
      device_map[normalized] = {
        'offset': offset,
        'address_in': str(addr),
        'tag': tag,
        'function_code': function_code,
      }
  return mapping


def update_device_variables(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  device_map: dict[str, dict[str, object]],
) -> int:
  cur = conn.cursor(dictionary=True)
  cur.execute(
    'SELECT id, code, offset, address_in, function_code FROM device_variables WHERE device_id = %s',
    (device_id,),
  )
  rows = cur.fetchall()
  cur.close()

  updates: list[tuple[object, ...]] = []
  for row in rows:
    normalized = normalize_code(row.get('code'))
    if not normalized:
      continue
    override = device_map.get(normalized)
    if not override:
      continue
    offset = int(override.get('offset', row['offset']))
    address_in = str(override.get('address_in', row.get('address_in') or ''))
    override_function = override.get('function_code')
    function_code = int(override_function) if override_function is not None else row.get('function_code')
    current_function = row.get('function_code')
    if current_function is not None:
      current_function = int(current_function)
    if (
      row['offset'] != offset
      or (row.get('address_in') or '') != address_in
      or current_function != function_code
    ):
      updates.append((offset, address_in, function_code, row['id']))

  if not updates:
    return 0

  cur = conn.cursor()
  cur.executemany(
    'UPDATE device_variables SET offset = %s, address_in = %s, function_code = %s WHERE id = %s',
    updates,
  )
  conn.commit()
  cur.close()
  return len(updates)


def set_dashboard_variables(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  codes: list[str],
) -> None:
  cur = conn.cursor(dictionary=True)
  placeholders = ','.join(['%s'] * len(codes))
  cur.execute(
    f'SELECT id, code FROM device_variables WHERE device_id = %s AND code IN ({placeholders})',
    [device_id, *codes],
  )
  rows = cur.fetchall()
  code_map = {row['code']: row['id'] for row in rows}
  cur.close()

  cur = conn.cursor()
  cur.execute('DELETE FROM device_dashboard_variables WHERE device_id = %s', (device_id,))
  insert_rows = [
    (device_id, code_map[code], idx)
    for idx, code in enumerate(codes)
    if code in code_map
  ]
  if insert_rows:
    cur.executemany(
      'INSERT INTO device_dashboard_variables (device_id, variable_id, display_order) VALUES (%s, %s, %s)',
      insert_rows,
    )
  conn.commit()
  cur.close()


def update_labels(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  label_map: dict[str, str],
) -> None:
  cur = conn.cursor()
  for code, label in label_map.items():
    cur.execute(
      'UPDATE device_variables SET label = %s WHERE device_id = %s AND code = %s',
      (label, device_id, code),
    )
  conn.commit()
  cur.close()


def main() -> None:
  db_url = os.getenv('DATABASE_URL', DEFAULT_URL)
  cfg = parse_database_url(db_url)
  server_file = os.getenv('MODBUS_SERVER_MAP_FILE', DEFAULT_SERVER_MAP)
  server_path = resolve_model_path(server_file)
  server_map = parse_server_modbus_map(server_path)
  conn = mysql.connector.connect(**cfg)

  cur = conn.cursor(dictionary=True)
  cur.execute('SELECT id, modbus_id, model_file FROM devices')
  devices = cur.fetchall()
  cur.close()

  total_updates = 0
  for device in devices:
    device_id = int(device['id'])
    unit_id = int(device['modbus_id'])
    device_map = server_map.get(unit_id)
    if not device_map:
      continue
    updated = update_device_variables(conn, device_id, device_map)
    total_updates += updated
    print(f'Device {device_id} (unit {unit_id}): {updated} offsets atualizados')

  mpx_modbus_ids = {3, 4, 9, 10}
  mpx_codes = ['Po1', 'Po2', 'Po3', 'Po4', 'airoff']
  mpx_labels = {
    'Po1': 'Superaquecimento',
    'Po2': 'Abertura da valvula',
    'Po3': 'Temperatura de succao (tGS)',
    'Po4': 'Temperatura de evaporacao (tEu)',
    'airoff': 'Temperatura (ta)',
    's_din5': 'status DESLIGADO',
    'd73': 'Situacao da regulamentacao local',
    'OFFLINE': 'Sem',
    's_LO': 'Alarme de baixa temperatura (Sonda de ar desligada se houver termostato duplo)',
    's_HI': 'Alarme de alta temperatura (Sonda de ar desligada se houver termostato duplo)',
    's_Ldt': 'Alarme LSA (baixa temperatura de succao)',
    's_Edc': 'Erro de comunicacao do driver do motor de passo',
    's_EFS': 'Erro no motor de passo',
    's_bLO': 'Problemas de instalacao ou configuracao (EEV para interruptor de limite)',
    's_EE': 'Alarme EEPROM de parametros da maquina',
    's_EF': 'Alarme de EEPROM de parametros funcionais',
    'Ht0': 'Alarme HACCP',
  }
  bmb_codes = ['U01_PGL', 'U02_TRGL', 'm31_B1_ligada', 'm33_B2_ligada', 'm34_fluxo_falha']
  for device in devices:
    device_id = int(device['id'])
    model_file = (device.get('model_file') or '').lower()
    if int(device.get('modbus_id') or 0) in mpx_modbus_ids:
      set_dashboard_variables(conn, device_id, mpx_codes)
      update_labels(conn, device_id, mpx_labels)
      print(f'Device {device_id}: dashboard MPX ajustado ({", ".join(mpx_codes)})')
      continue
    if model_file == 'skid_bmb_mod_mini.xml':
      set_dashboard_variables(conn, device_id, bmb_codes)
      print(f'Device {device_id}: dashboard BMB ajustado ({", ".join(bmb_codes)})')

  conn.close()
  print(f'OK. Offsets atualizados: {total_updates}')


if __name__ == '__main__':
  main()
