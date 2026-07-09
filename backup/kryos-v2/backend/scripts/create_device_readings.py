from __future__ import annotations

import os
from urllib.parse import urlparse

import mysql.connector


def main() -> None:
  db_url = os.getenv('DATABASE_URL', 'mysql+mysqlconnector://root:root@localhost:3305/kryos')
  url = urlparse(db_url)
  cfg = {
    'host': url.hostname,
    'port': url.port or 3305,
    'user': url.username,
    'password': url.password,
    'database': (url.path or '').lstrip('/'),
  }
  conn = mysql.connector.connect(**cfg)
  cur = conn.cursor()
  cur.execute(
    """
    CREATE TABLE IF NOT EXISTS device_readings (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      device_id BIGINT NOT NULL,
      variable_id BIGINT,
      code VARCHAR(160),
      value DOUBLE,
      status VARCHAR(60),
      error TEXT,
      response_ms INT,
      raw_registers JSON,
      captured_at DATETIME NOT NULL,
      FOREIGN KEY (device_id) REFERENCES devices(id)
    )
    """
  )
  try:
    cur.execute("CREATE INDEX IF NOT EXISTS idx_device_readings_device_time ON device_readings (device_id, captured_at)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_device_readings_device_code_time ON device_readings (device_id, code, captured_at)")
  except mysql.connector.errors.ProgrammingError:
    # For MySQL versions without IF NOT EXISTS on indexes
    try:
      cur.execute("CREATE INDEX idx_device_readings_device_time ON device_readings (device_id, captured_at)")
    except Exception:
      pass
    try:
      cur.execute("CREATE INDEX idx_device_readings_device_code_time ON device_readings (device_id, code, captured_at)")
    except Exception:
      pass
  conn.commit()
  print('device_readings checked/created')
  cur.close()
  conn.close()


if __name__ == '__main__':
  main()
