from __future__ import annotations

import os
import json
from urllib.parse import urlparse

import mysql.connector

import struct
import xml.etree.ElementTree as ET

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


def main() -> None:
  db_url = os.getenv('DATABASE_URL', '')
  if not db_url:
    env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
    try:
      with open(env_path, 'r', encoding='utf-8') as handle:
        for line in handle:
          if line.strip().startswith('DATABASE_URL='):
            db_url = line.split('=', 1)[1].strip()
            break
    except FileNotFoundError:
      db_url = ''
  if not db_url:
    raise RuntimeError('DATABASE_URL nao encontrado')
  cfg = parse_database_url(db_url)
  conn = mysql.connector.connect(**cfg)
  cur = conn.cursor(dictionary=True)
  cur.execute('SELECT model_file FROM devices WHERE id = %s', (1,))
  device_row = cur.fetchone()
  model_file = device_row.get('model_file') if device_row else None
  if model_file:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'Models', model_file)
    try:
      tree = ET.parse(model_path)
      root = tree.getroot()
      device_node = root.find('.//Device')
      little_endian = device_node.attrib.get('littleEndian') if device_node is not None else None
      print(f'model_file={model_file} littleEndian={little_endian}')
    except FileNotFoundError:
      print(f'model_file={model_file} (nao encontrado)')
  codes = ['m05_PS_geral', 'm06_PD_geral', 'm10_SH']
  def decode_float(registers: list[int], mode: str) -> float | None:
    if len(registers) < 2:
      return None
    r0, r1 = registers[0], registers[1]
    if mode == 'be':
      packed = struct.pack('>HH', r0, r1)
    elif mode == 'swap':
      packed = struct.pack('>HH', r1, r0)
    elif mode == 'byteswap':
      r0b = ((r0 & 0xFF) << 8) | ((r0 >> 8) & 0xFF)
      r1b = ((r1 & 0xFF) << 8) | ((r1 >> 8) & 0xFF)
      packed = struct.pack('>HH', r0b, r1b)
    elif mode == 'swap_bytes':
      r0b = ((r0 & 0xFF) << 8) | ((r0 >> 8) & 0xFF)
      r1b = ((r1 & 0xFF) << 8) | ((r1 >> 8) & 0xFF)
      packed = struct.pack('>HH', r1b, r0b)
    else:
      return None
    return struct.unpack('>f', packed)[0]

  def decode_int(registers: list[int], mode: str) -> int | None:
    if len(registers) < 2:
      return None
    r0, r1 = registers[0], registers[1]
    if mode == 'be':
      return (r0 << 16) | r1
    if mode == 'swap':
      return (r1 << 16) | r0
    return None

  for code in codes:
    cur.execute(
      (
        'SELECT code, value, status, raw_registers, captured_at '
        'FROM device_readings '
        'WHERE device_id = %s AND code = %s '
        'ORDER BY captured_at DESC LIMIT 1'
      ),
      (1, code),
    )
    row = cur.fetchone()
    if not row:
      print(f'{code}: sem device_readings')
      continue
    raw = row.get('raw_registers')
    try:
      raw_parsed = json.loads(raw) if raw else None
    except json.JSONDecodeError:
      raw_parsed = raw
    computed: dict[str, object] = {}
    if isinstance(raw_parsed, list) and len(raw_parsed) >= 2:
      for mode in ('be', 'swap', 'byteswap', 'swap_bytes'):
        computed[mode] = decode_float(raw_parsed, mode)
      for mode in ('be', 'swap'):
        computed[f'int_{mode}'] = decode_int(raw_parsed, mode)
    print(
      f"{code}: value={row.get('value')} status={row.get('status')} raw={raw_parsed} "
      f"calc={computed} at={row.get('captured_at')}"
    )
  cur.close()
  conn.close()


if __name__ == '__main__':
  main()
