from __future__ import annotations

import os
import socket
from urllib.parse import urlparse

import mysql.connector

DEFAULT_DB_URL = 'mysql+mysqlconnector://root:root@localhost:3305/kryos'


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


def parse_tcp_hostname(hostname: str) -> tuple[str, int]:
  if ':' in hostname:
    host, port = hostname.split(':', 1)
    return host.strip(), int(port)
  return hostname.strip(), 502


def check_tcp(host: str, port: int, timeout: float = 2.0) -> tuple[bool, str | None]:
  try:
    with socket.create_connection((host, port), timeout=timeout):
      return True, None
  except Exception as exc:  # noqa: BLE001
    return False, str(exc)


def main() -> None:
  db_url = os.getenv('DATABASE_URL', DEFAULT_DB_URL)
  cfg = parse_database_url(db_url)
  conn = mysql.connector.connect(**cfg)
  cur = conn.cursor(dictionary=True)
  cur.execute(
    """
    SELECT d.id AS device_id, d.name, d.modbus_id, d.model_file,
           p.hostname, p.name AS plant_name
    FROM devices d
    JOIN plants p ON p.id = d.plant_id
    ORDER BY p.id, d.id
    """
  )
  devices = cur.fetchall()
  cur.close()
  conn.close()

  if not devices:
    print('Nenhum device encontrado no banco.')
    return

  offline = []
  for dev in devices:
    host_raw = dev.get('hostname') or ''
    host, port = parse_tcp_hostname(host_raw)
    ok, err = check_tcp(host, port)
    status = 'online' if ok else 'offline'
    info = f"plant={dev.get('plant_name')} host={host}:{port} device_id={dev.get('device_id')} name={dev.get('name')} model={dev.get('model_file')} modbus_id={dev.get('modbus_id')} status={status}"
    if not ok and err:
      info += f" error={err}"
    print(info)
    if not ok:
      offline.append(info)

  print(f'\nResumo: {len(devices)} devices, {len(offline)} offline.')
  if offline:
    print('Offline:')
    for item in offline:
      print(' ', item)


if __name__ == '__main__':
  main()
