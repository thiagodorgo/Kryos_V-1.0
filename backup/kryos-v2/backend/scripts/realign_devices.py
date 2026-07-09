from __future__ import annotations

import os
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import mysql.connector

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_URL = 'mysql+mysqlconnector://root:root@localhost:3305/kryos'

MPX_MODBUS_IDS = {3, 4, 9, 10}
PCO_COMP_MODBUS_IDS = {1, 5}
PCO_BMB_MODBUS_IDS = {2, 6, 7, 8, 11}

COMP_DASHBOARD_CODES = ['m05_PS_geral', 'm06_PD_geral', 'm10_SH']
BMB_DASHBOARD_CODES = ['U01_PGL', 'U02_TRGL', 'm31_B1_ligada', 'm33_B2_ligada', 'm34_fluxo_falha']

RENAME_BY_MODBUS_ID = {
  5: 'SKID-02-COMP-GLICOL',
}
MPX_DASHBOARD_CODES = ['Po1', 'Po2', 'Po3', 'Po4', 'airoff']
MPX_LABELS = {
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


def resolve_device_image(model_file: str | None, device_code: str | None) -> tuple[str, str]:
  if model_file:
    model_key = model_file.lower().strip()
    if model_key == 'mpxpro-amp-padrao.xml':
      return 'mpx-pro', '/images/MPX.png'
    if model_key == 'skid_bmb_mod_mini.xml':
      return 'pco', '/images/pCO.png'
    if model_key == 'skid_5cp_modbus_0.xml':
      return 'pco', '/images/pCO.png'
  if device_code and 'mpx' in device_code.lower():
    return 'mpx-pro', '/images/MPX.png'
  return 'pco', '/images/pCO.png'


def parse_var_metadata(model_path: Path) -> dict[str, dict[str, object]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  metadata: dict[str, dict[str, object]] = {}
  for var_node in root.findall('.//Vars/Var'):
    code = var_node.attrib.get('code')
    if not code:
      continue
    decimals = var_node.attrib.get('decimal')
    try:
      decimals_value = int(decimals) if decimals is not None and decimals != '' else None
    except ValueError:
      decimals_value = None
    metadata[code] = {
      'measure_unit': var_node.attrib.get('measureUnit') or None,
      'decimals': decimals_value,
    }
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


def parse_model_info(model_path: Path) -> tuple[str | None, list[dict[str, object]]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  device_node = root.find('.//Device')
  device_code = device_node.attrib.get('code') if device_node is not None else None
  entries = parse_modbus_map(model_path)
  return device_code, entries


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


def delete_device_variables(conn: mysql.connector.MySQLConnection, device_id: int) -> None:
  cur = conn.cursor()
  cur.execute('DELETE FROM device_dashboard_variables WHERE device_id = %s', (device_id,))
  cur.execute('DELETE FROM device_variables WHERE device_id = %s', (device_id,))
  conn.commit()
  cur.close()


def insert_device_variables(
  conn: mysql.connector.MySQLConnection,
  device_id: int,
  entries: list[dict[str, object]],
  descriptions: dict[str, str],
) -> int:
  rows_to_insert: list[tuple[object, ...]] = []
  for entry in entries:
    for code in entry.get('codes', []) or []:
      if not code:
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


def upsert_device_asset(conn: mysql.connector.MySQLConnection, device_id: int, model_file: str | None, device_code: str | None) -> None:
  image_key, image_path = resolve_device_image(model_file, device_code)
  cur = conn.cursor()
  cur.execute('DELETE FROM device_assets WHERE device_id = %s', (device_id,))
  cur.execute(
    'INSERT INTO device_assets (device_id, model_file, image_key, image_path) VALUES (%s, %s, %s, %s)',
    (device_id, model_file, image_key, image_path),
  )
  conn.commit()
  cur.close()


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
  conn = mysql.connector.connect(**cfg)

  cur = conn.cursor(dictionary=True)
  cur.execute('SELECT id, modbus_id, name FROM devices')
  devices = cur.fetchall()
  cur.close()

  for device in devices:
    device_id = int(device['id'])
    modbus_id = int(device['modbus_id'])
    if modbus_id in MPX_MODBUS_IDS:
      model_file = 'MPXPRO-AMP-PADRAO.xml'
    elif modbus_id in PCO_COMP_MODBUS_IDS:
      model_file = 'SKID_5Cp_modbus_0.xml'
    else:
      model_file = 'SKID_BMB_MOD_MINI.xml'

    model_path = resolve_model_path(model_file)
    device_code, entries = parse_model_info(model_path)
    descriptions = parse_var_descriptions(model_path)
    delete_device_variables(conn, device_id)
    inserted = insert_device_variables(conn, device_id, entries, descriptions)

    next_name = RENAME_BY_MODBUS_ID.get(modbus_id, device['name'])
    cur = conn.cursor()
    cur.execute(
      'UPDATE devices SET name = %s, model_file = %s, device_code = %s, family_code = %s WHERE id = %s',
      (next_name, model_file, device_code, device_code, device_id),
    )
    conn.commit()
    cur.close()
    upsert_device_asset(conn, device_id, model_file, device_code)
    print(f'Device {device_id} (modbus {modbus_id}): modelo {model_file}, variaveis {inserted}')

    if modbus_id in MPX_MODBUS_IDS:
      set_dashboard_variables(conn, device_id, MPX_DASHBOARD_CODES)
      update_labels(conn, device_id, MPX_LABELS)
      print(f'Device {device_id}: dashboard MPX ajustado')
    elif modbus_id in PCO_COMP_MODBUS_IDS:
      set_dashboard_variables(conn, device_id, COMP_DASHBOARD_CODES)
      print(f'Device {device_id}: dashboard {", ".join(COMP_DASHBOARD_CODES)}')
    else:
      set_dashboard_variables(conn, device_id, BMB_DASHBOARD_CODES)
      print(f'Device {device_id}: dashboard {", ".join(BMB_DASHBOARD_CODES)}')

  conn.close()
  print('OK')


if __name__ == '__main__':
  main()
