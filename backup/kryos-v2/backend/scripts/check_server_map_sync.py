from __future__ import annotations

import os
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

import mysql.connector

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_URL = 'mysql+mysqlconnector://root:root@localhost:3305/kryos'
DEFAULT_SERVER = 'panifresh_modbus_server_20260106224146.xml'


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


def normalize_code(code: str | None) -> str:
  return (code or '').strip().lower()


def parse_server_map(model_path: Path) -> dict[int, set[str]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  mapping: dict[int, set[str]] = {}
  for device_node in root.findall('.//device'):
    addr_raw = device_node.attrib.get('addr')
    try:
      unit_id = int(addr_raw)
    except (TypeError, ValueError):
      continue
    codes: set[str] = set()
    for node in list(device_node):
      tag = (node.tag or '').lower()
      if tag not in ('reg', 'coil'):
        continue
      code = normalize_code(node.attrib.get('code'))
      if code:
        codes.add(code)
    mapping[unit_id] = codes
  return mapping


def main() -> None:
  db_url = os.getenv('DATABASE_URL', DEFAULT_URL)
  cfg = parse_database_url(db_url)
  server_file = os.getenv('MODBUS_SERVER_MAP_FILE', DEFAULT_SERVER)
  server_path = resolve_model_path(server_file)
  server_map = parse_server_map(server_path)

  conn = mysql.connector.connect(**cfg)
  cur = conn.cursor(dictionary=True)
  cur.execute('SELECT id, modbus_id, name FROM devices')
  device_rows = cur.fetchall()
  cur.close()

  unit_to_device = {int(row['modbus_id']): row for row in device_rows}

  total_missing = 0
  total_codes = 0
  for unit_id in sorted(server_map.keys()):
    server_codes = server_map[unit_id]
    total_codes += len(server_codes)
    device = unit_to_device.get(unit_id)
    if not device:
      print(f'Unit {unit_id}: sem device no banco ({len(server_codes)} codigos no XML)')
      total_missing += len(server_codes)
      continue
    cur = conn.cursor()
    cur.execute(
      'SELECT code FROM device_variables WHERE device_id = %s',
      (device['id'],),
    )
    db_codes = {normalize_code(row[0]) for row in cur.fetchall()}
    cur.close()
    missing = sorted(server_codes - db_codes)
    total_missing += len(missing)
    print(
      f"Unit {unit_id} (device {device['id']}): "
      f'XML {len(server_codes)} codigos, DB {len(db_codes)} codigos, '
      f'faltando {len(missing)}'
    )
    if missing:
      preview = ', '.join(missing[:12])
      print(f'  Exemplo faltando: {preview}')

  conn.close()
  print(f'Total XML codigos: {total_codes}, faltando no DB: {total_missing}')


if __name__ == '__main__':
  main()
