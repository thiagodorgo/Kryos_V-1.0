from __future__ import annotations
import logging
from urllib.parse import urlparse
from typing import Any

import mysql.connector
from mysql.connector import pooling
from mysql.connector.pooling import PooledMySQLConnection

from .config import get_settings

logger = logging.getLogger(__name__)

_pool: pooling.MySQLConnectionPool | None = None

def _parse_mysql_url(database_url: str) -> dict[str, Any]:
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

def get_pool() -> pooling.MySQLConnectionPool | None:
  global _pool
  if _pool is not None:
    return _pool
  settings = get_settings()
  try:
    config = _parse_mysql_url(settings.database_url)
    requested_size = int(getattr(settings, 'db_pool_size', 20) or 20)
    pool_size = max(1, min(32, requested_size))
    if pool_size != requested_size:
      logger.warning('DB_POOL_SIZE ajustado para %s (limite do conector)', pool_size)
    _pool = pooling.MySQLConnectionPool(
      pool_name='kryos',
      pool_size=pool_size,
      pool_reset_session=True,
      **config,
    )
    return _pool
  except Exception as exc:  # noqa: BLE001
    logger.warning('Pool MySQL não inicializado, usando dados em memória. Erro: %s', exc)
    return None

def query(sql: str, params: tuple[Any, ...] | None = None) -> list[dict[str, Any]]:
  pool = get_pool()
  if pool is None:
    return []
  conn: PooledMySQLConnection | None = None
  try:
    conn = pool.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(sql, params or ())
    rows = cursor.fetchall()
    cursor.close()
    return rows
  except Exception as exc:  # noqa: BLE001
    logger.error('Erro ao consultar o MySQL: %s', exc)
    return []
  finally:
    if conn:
      conn.close()


def execute(sql: str, params: tuple[Any, ...] | list[tuple[Any, ...]] | None = None, many: bool = False) -> int | None:
  pool = get_pool()
  if pool is None:
    return None
  conn: PooledMySQLConnection | None = None
  try:
    conn = pool.get_connection()
    cursor = conn.cursor()
    if many and params is not None:
      cursor.executemany(sql, params)
    else:
      cursor.execute(sql, params or ())
    conn.commit()
    last_id = cursor.lastrowid
    cursor.close()
    return last_id
  except Exception as exc:  # noqa: BLE001
    logger.error('Erro ao executar comando no MySQL: %s', exc)
    return None
  finally:
    if conn:
      conn.close()
