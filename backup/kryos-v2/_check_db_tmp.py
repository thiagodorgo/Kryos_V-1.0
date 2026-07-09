import os
from urllib.parse import urlparse

import mysql.connector


def main() -> None:
  url = urlparse(os.getenv('DATABASE_URL', ''))
  cfg = {
    'host': url.hostname,
    'port': url.port or 3305,
    'user': url.username,
    'password': url.password,
    'database': (url.path or '').lstrip('/'),
  }
  conn = mysql.connector.connect(**cfg)
  cur = conn.cursor()
  cur.execute('SHOW TABLES')
  print('Tables:', [r[0] for r in cur.fetchall()])
  for tbl in ['device_readings', 'telemetry', 'devices', 'device_variables', 'scan_sessions', 'scan_results']:
    try:
      cur.execute(f'SHOW COLUMNS FROM {tbl}')
      cols = cur.fetchall()
      print(f'\n{tbl}: {len(cols)} cols')
      for c in cols:
        print(' ', c[0], c[1])
    except Exception as exc:  # noqa: BLE001
      print(f'\n{tbl}: ERROR {exc}')
  cur.close()
  conn.close()


def check_device_variables(conn: mysql.connector.MySQLConnection, device_ids: list[int]) -> None:
  cur = conn.cursor()
  placeholders = ','.join(['%s'] * len(device_ids))
  cur.execute(
    f'SELECT id, name, model_file, device_code FROM devices WHERE id IN ({placeholders})',
    tuple(device_ids),
  )
  print('\nDevices:', cur.fetchall())
  cur.execute(
    f'SELECT device_id, COUNT(*) FROM device_variables WHERE device_id IN ({placeholders}) GROUP BY device_id',
    tuple(device_ids),
  )
  print('\nDevice variables count:', cur.fetchall())
  codes = ('stu', 'tgs', 'teu', 'rd', 'dt1', 'dp1', 'al', 'ah', 'p3', 'p7', 'pm1', 'cp1', 's_pmp', 's_pmu')
  code_placeholders = ','.join(['%s'] * len(codes))
  cur.execute(
    (
      f'SELECT device_id, code FROM device_variables '
      f'WHERE device_id IN ({placeholders}) AND LOWER(code) IN ({code_placeholders}) '
      f'ORDER BY device_id, code'
    ),
    tuple(device_ids) + codes,
  )
  print('\nDevice variables (filtered):', cur.fetchall())
  cur.close()


if __name__ == '__main__':
  main()
  url = urlparse(os.getenv('DATABASE_URL', ''))
  cfg = {
    'host': url.hostname,
    'port': url.port or 3305,
    'user': url.username,
    'password': url.password,
    'database': (url.path or '').lstrip('/'),
  }
  conn = mysql.connector.connect(**cfg)
  check_device_variables(conn, [3, 4, 8, 9])
  conn.close()
