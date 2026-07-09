from __future__ import annotations

import os
from urllib.parse import urlparse

import mysql.connector


TABLES = [
  'telemetry',
  'device_readings',
  'device_dashboard_variables',
  'device_assets',
  'device_variables',
  'devices',
  'alarms',
  'scan_results',
  'scan_logs',
  'scan_sessions',
  'plants',
]


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
  database_url = os.getenv('DATABASE_URL')
  if not database_url:
    raise SystemExit('DATABASE_URL nao encontrado no ambiente.')
  config = parse_database_url(database_url)
  conn = mysql.connector.connect(**config, connection_timeout=5)
  cursor = conn.cursor()
  cursor.execute('SET FOREIGN_KEY_CHECKS=0')
  for table in TABLES:
    try:
      cursor.execute(f'TRUNCATE TABLE {table}')
    except mysql.connector.errors.ProgrammingError as exc:
      if exc.errno != 1146:
        raise
  cursor.execute('SET FOREIGN_KEY_CHECKS=1')
  conn.commit()
  cursor.close()
  conn.close()
  print('OK: dados apagados.')


if __name__ == '__main__':
  main()
