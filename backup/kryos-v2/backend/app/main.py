from __future__ import annotations
import asyncio
import json
import os
import struct
import threading
import xml.etree.ElementTree as ET
import logging
from datetime import datetime, timedelta
from ipaddress import ip_address
from time import perf_counter, sleep
from typing import Any, Literal
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect, File, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from .config import get_settings
from .db import execute, get_pool, query

logger = logging.getLogger(__name__)

settings = get_settings()
app = FastAPI(title='Kryos Backend', version='0.3.0')

try:
  from pymodbus.client import ModbusSerialClient, ModbusTcpClient
except Exception:  # noqa: BLE001
  ModbusSerialClient = None
  ModbusTcpClient = None

scan_sessions_cache: dict[int, dict[str, Any]] = {}
scan_results_cache: dict[int, list[dict[str, Any]]] = {}
scan_logs_cache: dict[int, list[dict[str, Any]]] = {}
scan_progress_cache: dict[int, dict[str, Any]] = {}
scan_summary_cache: dict[int, dict[str, Any]] = {}
scan_cancel_events: dict[int, threading.Event] = {}
plants_cache: dict[int, dict[str, Any]] = {}
devices_cache: dict[int, dict[str, Any]] = {}
device_variables_cache: dict[int, list[dict[str, Any]]] = {}
latest_telemetry_cache: dict[int, list[dict[str, Any]]] = {}
server_modbus_map_cache: dict[str, dict[int, dict[str, dict[str, Any]]]] = {}
model_word_swap_cache: dict[str, bool] = {}
code_metadata_cache: dict[str, dict[str, Any]] | None = None
model_metadata_cache: dict[str, dict[str, dict[str, Any]]] = {}
model_code_index_cache: dict[str, set[str]] | None = None
model_unique_code_cache: dict[str, set[str]] | None = None
model_device_code_index_cache: dict[str, list[str]] | None = None
model_protocol_cache: dict[str, str] = {}
model_dashboard_defaults_cache: dict[str, list[str]] = {}
model_function_map_cache: dict[str, dict[str, int]] = {}
poller_thread: threading.Thread | None = None
poller_stop = threading.Event()
last_retention_cleanup: float | None = None
last_user_activity: float = datetime.utcnow().timestamp()

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.allowed_origins,
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
)

fallback_plants = [
  {
    "id": 1,
    "name": "Planta Norte",
    "status": "online",
    "vpn_tunnel": "Ativo",
    "hostname": "10.0.1.20",
    "server_map_file": None,
  },
  {
    "id": 2,
    "name": "Planta Sul",
    "status": "alert",
    "vpn_tunnel": "Ativo",
    "hostname": "10.0.2.10",
    "server_map_file": None,
  },
]

fallback_devices = {
  1: [
    {"id": 10, "name": "Compressor 01", "modbus_id": 1, "family_code": "CAREL-A1", "alarm_active": False, "last_seen_at": "2024-06-12T10:00:00Z"},
    {"id": 11, "name": "Evaporador 02", "modbus_id": 2, "family_code": "CAREL-B1", "alarm_active": True, "last_seen_at": "2024-06-12T10:01:00Z"},
  ],
  2: [
    {"id": 20, "name": "Compressor 03", "modbus_id": 4, "family_code": "CAREL-A1", "alarm_active": False, "last_seen_at": "2024-06-12T09:58:00Z"},
  ],
}

fallback_telemetry: dict[int, dict[str, float | int]] = {
  1: {
    'ai01_PS1': 1.07,
    'ai02_PS2': 1.07,
    'ai03_PD1': 10.97,
    'ai04_PD2': 10.85,
    'ai05_TS': 26.8,
    'ai06_C1_TD': 27.3,
    'ai07_C2_TD': 27.6,
    'ai08_C3_TD': 27.1,
    'ao01_comp_0_10V': 0.0,
    'ao02_vent_0_10V': 0.0,
    'do01_C1_liga': 1,
    'do02_C2_liga': 1,
    'do03_C3_liga': 1,
    'do08_M2_liga': 1,
    'do09_M3_liga': 1,
    'do10_M4_liga': 1,
    'do11_M5_liga': 1,
    'do12_M6_liga': 1,
    'do13_M7_liga': 1,
    'm08_temp_evaporacao': -29.2,
    'm09_temp_cond': 23.6,
    'm14_baixa_TS': 1,
    'm30_C1_pre_requisito': 1,
    'm31_C1_conf_partida': 1,
    'm32_C2_pre_requisito': 1,
    'm33_C2_conf_partida': 1,
    'm34_C3_pre_requisito': 1,
    'm35_C3_conf_partida': 1,
    'm41_emergencia': 0,
  },
}

fallback_alarms = {
  2: [
    {
      "id": 200,
      "plant_id": 2,
      "device_id": 20,
      "code": "ALM-018",
      "description": "Alta temperatura de descarga",
      "severity": "Alta",
      "opened_at": "2024-06-12T08:12:00Z",
      "acknowledged_at": None,
    }
  ]
}


class LoginRequest(BaseModel):
  email: str
  password: str | None = None


class LoginResponse(BaseModel):
  token: str
  user: dict[str, Any]


class AIRequest(BaseModel):
  alarm: dict[str, Any]
  telemetry: dict[str, Any] | None = None


class ScanRequest(BaseModel):
  protocol: Literal['tcp', 'rtu'] = 'tcp'
  start_ip: str | None = None
  end_ip: str | None = None
  port: int = 502
  timeout: float = 2.0
  unit_id_start: int = 1
  unit_id_end: int = 10
  function_codes: list[int] = Field(default_factory=lambda: [3, 4])
  offset: int = 0
  length: int = 1
  length_map: dict[int, int] | None = None
  com_port: str | None = None
  baud_rate: int = 19200
  parity: Literal['N', 'E', 'O'] = 'N'
  stop_bits: int = 1
  bytesize: int = 8

  @field_validator('end_ip')
  @classmethod
  def validate_ip_range(cls, value, info):  # noqa: ANN001
    protocol = info.data.get('protocol')
    start_ip = info.data.get('start_ip')
    if protocol == 'tcp':
      if not start_ip or not value:
        raise ValueError('start_ip e end_ip sao obrigatorios para TCP')
      ip_address(start_ip)
      ip_address(value)
    return value

  @field_validator('com_port')
  @classmethod
  def validate_serial_port(cls, value, info):  # noqa: ANN001
    if info.data.get('protocol') == 'rtu' and not value:
      raise ValueError('com_port e obrigatorio para RTU')
    return value


class FullScanRequest(BaseModel):
  protocol: Literal['tcp', 'rtu'] = 'tcp'
  host: str | None = None
  port: int = 502
  timeout: float = 2.0
  unit_id: int = 1
  model_file: str
  function_codes: list[int] = Field(default_factory=lambda: [1, 2, 3, 4])
  offset_start: int = 0
  length_map: dict[int, int] | None = None
  com_port: str | None = None
  baud_rate: int = 19200
  parity: Literal['N', 'E', 'O'] = 'N'
  stop_bits: int = 1
  bytesize: int = 8

  @field_validator('host')
  @classmethod
  def validate_host(cls, value, info):  # noqa: ANN001
    if info.data.get('protocol') == 'tcp' and not value:
      raise ValueError('host e obrigatorio para TCP')
    return value

  @field_validator('model_file')
  @classmethod
  def validate_model_file(cls, value):  # noqa: ANN001
    if not value or not value.strip():
      raise ValueError('model_file e obrigatorio')
    return value.strip()

  @field_validator('com_port')
  @classmethod
  def validate_full_scan_serial_port(cls, value, info):  # noqa: ANN001
    if info.data.get('protocol') == 'rtu' and not value:
      raise ValueError('com_port e obrigatorio para RTU')
    return value


class IntelligentScanRequest(BaseModel):
  protocol: Literal['tcp', 'rtu'] = 'tcp'
  host: str | None = None
  port: int = 502
  timeout: float = 2.0
  unit_id_start: int = 1
  unit_id_end: int = 10
  function_codes: list[int] = Field(default_factory=lambda: [1, 2, 3, 4])
  length_map: dict[int, int] | None = None
  com_port: str | None = None
  baud_rate: int = 19200
  parity: Literal['N', 'E', 'O'] = 'N'
  stop_bits: int = 1
  bytesize: int = 8

  @field_validator('host')
  @classmethod
  def validate_intelligent_host(cls, value, info):  # noqa: ANN001
    if info.data.get('protocol') == 'tcp' and not value:
      raise ValueError('host e obrigatorio para TCP')
    return value

  @field_validator('com_port')
  @classmethod
  def validate_intelligent_serial_port(cls, value, info):  # noqa: ANN001
    if info.data.get('protocol') == 'rtu' and not value:
      raise ValueError('com_port e obrigatorio para RTU')
    return value


def iter_ip_range(start_ip: str, end_ip: str) -> list[str]:
  start = int(ip_address(start_ip))
  end = int(ip_address(end_ip))
  if end < start:
    start, end = end, start
  return [str(ip_address(value)) for value in range(start, end + 1)]


def read_modbus(client, unit_id: int, function_code: int, offset: int, length: int) -> tuple[str, list[int] | None, str | None, int]:
  start_time = perf_counter()
  try:
    if function_code == 1:
      response = client.read_coils(offset, length, slave=unit_id)
      registers = list(response.bits) if not response.isError() else None
    elif function_code == 2:
      response = client.read_discrete_inputs(offset, length, slave=unit_id)
      registers = list(response.bits) if not response.isError() else None
    elif function_code == 3:
      response = client.read_holding_registers(offset, length, slave=unit_id)
      registers = list(response.registers) if not response.isError() else None
    elif function_code == 4:
      response = client.read_input_registers(offset, length, slave=unit_id)
      registers = list(response.registers) if not response.isError() else None
    else:
      return 'Invalid', None, f'Funcao nao suportada: {function_code}', 0
  except Exception as exc:  # noqa: BLE001
    elapsed_ms = int((perf_counter() - start_time) * 1000)
    return 'Error', None, str(exc), elapsed_ms

  elapsed_ms = int((perf_counter() - start_time) * 1000)
  if response is None:
    return 'Timeout', None, 'Sem resposta do dispositivo', elapsed_ms
  if response.isError():
    return 'Exception', None, str(response), elapsed_ms
  return 'Good', registers, None, elapsed_ms


MAX_COILS_PER_READ = 2000
MAX_REGISTERS_PER_READ = 120
DEFAULT_BATCH_GAP_REGISTERS = 2


def build_read_batches(
  variables: list[dict[str, Any]],
  max_gap: int = 0,
) -> list[dict[str, Any]]:
  batches: list[dict[str, Any]] = []
  by_function: dict[int, list[dict[str, Any]]] = {}
  for variable in variables:
    function_code = int(variable.get('function_code') or 0)
    if function_code <= 0:
      continue
    by_function.setdefault(function_code, []).append(variable)
  for function_code, items in by_function.items():
    sorted_items = sorted(items, key=lambda item: int(item.get('offset') or 0))
    max_len = MAX_COILS_PER_READ if function_code in (1, 2) else MAX_REGISTERS_PER_READ
    current: dict[str, Any] | None = None
    for item in sorted_items:
      start = int(item.get('offset') or 0)
      length = int(item.get('length') or 1)
      end = start + max(1, length) - 1
      if current is None:
        current = {
          'function_code': function_code,
          'start': start,
          'end': end,
          'variables': [item],
        }
        continue
      current_start = int(current['start'])
      current_end = int(current['end'])
      next_end = max(current_end, end)
      next_len = next_end - current_start + 1
      if start <= current_end + 1 + max(0, int(max_gap)) and next_len <= max_len:
        current['end'] = next_end
        current['variables'].append(item)
      else:
        batches.append({
          'function_code': function_code,
          'start': current_start,
          'length': int(current_end - current_start + 1),
          'variables': current['variables'],
        })
        current = {
          'function_code': function_code,
          'start': start,
          'end': end,
          'variables': [item],
        }
    if current is not None:
      batches.append({
        'function_code': function_code,
        'start': int(current['start']),
        'length': int(current['end'] - current['start'] + 1),
        'variables': current['variables'],
      })
  return batches


def resolve_length(function_code: int, fallback: int, length_map: dict[int, int] | None) -> int:
  if length_map and function_code in length_map:
    return max(1, int(length_map[function_code]))
  return max(1, fallback)


DEFAULT_FULL_SCAN_LIMITS = {
  1: 2048,
  2: 2048,
  3: 4096,
  4: 4096,
}

ACTIVE_POLL_INTERVAL_SECONDS = 30
IDLE_POLL_INTERVAL_SECONDS = ACTIVE_POLL_INTERVAL_SECONDS
USER_ACTIVITY_WINDOW_SECONDS = 120
WS_TELEMETRY_PUSH_INTERVAL_SECONDS = 0.5

READ_PRIORITY_ORDER: tuple[Literal['fast', 'medium', 'slow'], ...] = ('fast', 'medium', 'slow')
POLL_PRIORITY_INTERVALS_ACTIVE: dict[Literal['fast', 'medium', 'slow'], float] = {
  'fast': 0.25,
  'medium': 2.0,
  'slow': 15.0,
}
POLL_PRIORITY_INTERVALS_IDLE: dict[Literal['fast', 'medium', 'slow'], float] = {
  'fast': 1.5,
  'medium': 8.0,
  'slow': 30.0,
}

FAST_PRIORITY_HINTS = (
  'alarm', 'alarme', 'fault', 'trip', 'err', 'ps', 'press', 'suction', 'discharge',
  'superheat', 'sh', 'compressor', 'comp', 'c1_', 'c2_', 'c3_', 'po1', 'po2', 'po3', 'po4',
  'do', 'di',
)
MEDIUM_PRIORITY_HINTS = (
  'temp', 'te', 'td', 'ts', 'evap', 'cond', 'valv', 'delta', 'dp', 'nivel', 'level',
  'flow', 'humidity', 'umid',
)
SLOW_PRIORITY_HINTS = (
  'setpoint', 'set_', 'energy', 'kwh', 'counter', 'runtime', 'hours', 'log',
  'cfg', 'config', 'parameter',
)


def resolve_full_scan_end(function_code: int, offset_end_map: dict[int, int] | None) -> int:
  if offset_end_map and function_code in offset_end_map:
    return max(0, int(offset_end_map[function_code]))
  return DEFAULT_FULL_SCAN_LIMITS.get(function_code, 256)


def get_models_dir() -> str:
  return os.path.join(os.path.dirname(__file__), '..', 'Models')


MODEL_IMAGE_MAP = {
  'pjeasy.xml': ('pj', '/images/PJ.png'),
  'mpxpro-amp-padrao.xml': ('mpx-pro', '/images/MPX.png'),
  'mpxpro_modbus_amp_trocador.xml': ('mpx-pro', '/images/MPX.png'),
  'skid_bmb_mod_mini.xml': ('pco', '/images/pCO.png'),
  'skid_5cp_modbus_0.xml': ('pco', '/images/pCO.png'),
  'qualy_cond_modbus_0.xml': ('pco', '/images/pCO.png'),
  'qualy_succao_modbus_0.xml': ('pco', '/images/pCO.png'),
  'qualy_resist_carel_0.xml': ('pco', '/images/pCO.png'),
}

MPXPRO_PREFERRED_MODEL = 'mpxpro_modbus_amp_trocador.xml'
MPXPRO_HINT_CODES = {'po1', 'po2', 'po3', 'po4', 'airoff'}
MPXPRO_FLOAT_CODES = {'po1', 'po3', 'po4', 'airoff'}

WRITE_CODE_ALIASES = {
  'stu': 's_setpointwork',
  'tgs': 'po3',
  'teu': 'po4',
}


def resolve_device_image(model_file: str | None, device_code: str | None) -> tuple[str, str]:
  if model_file:
    explicit = MODEL_IMAGE_MAP.get(model_file.lower().strip())
    if explicit:
      return explicit
  if not model_file and not device_code:
    return 'pco', '/images/pCO.png'
  key_source = f'{model_file or ""} {device_code or ""}'.lower()
  if 'pjeasy' in key_source or 'pj' in key_source:
    return 'pj', '/images/PJ.png'
  if 'mpx' in key_source:
    return 'mpx-pro', '/images/MPX.png'
  if 'pco' in key_source:
    return 'pco', '/images/pCO.png'
  return 'pco', '/images/pCO.png'


def list_model_files() -> list[str]:
  models_dir = os.path.abspath(get_models_dir())
  try:
    files = [name for name in os.listdir(models_dir) if name.lower().endswith('.xml')]
  except FileNotFoundError:
    return []
  return sorted(files)


def is_server_map_file(model_file: str) -> bool:
  try:
    model_path = resolve_model_path(model_file)
    root = ET.parse(model_path).getroot()
  except Exception:  # noqa: BLE001
    return False
  return (root.tag or '').lower() == 'mbs_configuration'


def list_server_map_files() -> list[str]:
  return [name for name in list_model_files() if is_server_map_file(name)]


def list_device_model_files() -> list[str]:
  return [name for name in list_model_files() if not is_server_map_file(name)]


def normalize_model_reference(value: str | None) -> str | None:
  if not value:
    return None
  safe_name = os.path.basename(value.strip())
  return safe_name or None


def resolve_device_model_file(device_node: ET.Element) -> str | None:
  for key, raw_value in device_node.attrib.items():
    if not key:
      continue
    if key.lower() in {
      'model', 'model_file', 'modelfile', 'file', 'template', 'profile', 'modelo',
      'device_code', 'devicecode', 'code',
    }:
      normalized = normalize_model_reference(raw_value)
      if normalized:
        return normalized
  for child in list(device_node):
    tag = (child.tag or '').lower()
    if tag not in {'model', 'template', 'profile', 'modelo'}:
      continue
    for key, raw_value in child.attrib.items():
      if not key:
        continue
      if key.lower() in {'file', 'name', 'model', 'model_file', 'modelfile', 'device_code', 'devicecode', 'code'}:
        normalized = normalize_model_reference(raw_value)
        if normalized:
          return normalized
    if child.text:
      normalized = normalize_model_reference(child.text)
      if normalized:
        return normalized
  return None


def is_mpxpro_device(model_file: str | None, codes: set[str] | None = None) -> bool:
  if model_file and 'mpxpro' in model_file.strip().lower():
    return True
  if codes and len(codes & MPXPRO_HINT_CODES) >= 2:
    return True
  return False


def load_model_device_code_index() -> dict[str, list[str]]:
  global model_device_code_index_cache
  if model_device_code_index_cache is not None:
    return model_device_code_index_cache
  index: dict[str, list[str]] = {}
  for model_file in list_device_model_files():
    try:
      model_path = resolve_model_path(model_file)
      root = ET.parse(model_path).getroot()
      device_node = root.find('.//Device')
    except Exception:  # noqa: BLE001
      continue
    if device_node is None:
      continue
    device_code = (device_node.attrib.get('code') or '').strip().lower()
    if not device_code:
      continue
    index.setdefault(device_code, []).append(model_file)
  model_device_code_index_cache = index
  return model_device_code_index_cache


def get_model_protocol(model_file: str) -> str:
  key = model_file.strip().lower()
  cached = model_protocol_cache.get(key)
  if cached:
    return cached
  protocol = 'unknown'
  try:
    model_path = resolve_model_path(model_file)
    root = ET.parse(model_path).getroot()
    if root.find('.//Protos/Modbus') is not None:
      protocol = 'modbus'
    elif root.find('.//Protos/Carel') is not None:
      protocol = 'carel'
  except Exception:  # noqa: BLE001
    protocol = 'unknown'
  model_protocol_cache[key] = protocol
  return protocol


def score_model_for_codes(
  codes: set[str],
  model_file: str,
  model_codes: set[str],
  prefer_modbus: bool,
) -> tuple[int, float] | None:
  overlap = len(codes & model_codes)
  if overlap <= 0:
    return None
  device_count = max(1, len(codes))
  coverage = overlap / device_count
  model_coverage = overlap / max(1, len(model_codes))
  score = coverage * 0.7 + model_coverage * 0.3
  if prefer_modbus:
    protocol = get_model_protocol(model_file)
    if protocol == 'modbus':
      score += 0.05
    elif protocol == 'carel':
      score -= 0.02
  return overlap, score


def select_best_model_for_codes(
  codes: set[str],
  candidates: list[str],
  prefer_modbus: bool,
) -> str | None:
  if not candidates:
    return None
  if not codes:
    return sorted(candidates)[0]
  index = load_model_code_index()
  best_file = None
  best_overlap = -1
  best_score = -1.0
  for model_file in candidates:
    model_codes = index.get(model_file)
    if not model_codes:
      continue
    result = score_model_for_codes(codes, model_file, model_codes, prefer_modbus)
    if not result:
      continue
    overlap, score = result
    if (
      overlap > best_overlap
      or (overlap == best_overlap and score > best_score)
      or (overlap == best_overlap and score == best_score and (best_file is None or model_file < best_file))
    ):
      best_file = model_file
      best_overlap = overlap
      best_score = score
  if best_file:
    return best_file
  return sorted(candidates)[0]


def resolve_model_reference_to_file(
  reference: str | None,
  codes: set[str],
  prefer_modbus: bool,
) -> str | None:
  normalized = normalize_model_reference(reference)
  if not normalized:
    return None
  device_models = list_device_model_files()
  device_map = {name.lower(): name for name in device_models}
  direct = device_map.get(normalized.lower())
  if direct:
    return direct
  if not normalized.lower().endswith('.xml'):
    direct = device_map.get(f'{normalized}.xml'.lower())
    if direct:
      return direct
  base = os.path.splitext(normalized)[0].lower()
  base_map = {os.path.splitext(name)[0].lower(): name for name in device_models}
  direct = base_map.get(base)
  if direct:
    return direct
  device_index = load_model_device_code_index()
  candidates = device_index.get(normalized.lower())
  if candidates:
    return select_best_model_for_codes(codes, candidates, prefer_modbus)
  return None


def load_model_metadata(model_file: str) -> dict[str, dict[str, Any]]:
  key = model_file.strip().lower()
  cached = model_metadata_cache.get(key)
  if cached is not None:
    return cached
  model_path = resolve_model_path(model_file)
  var_meta_raw = parse_var_metadata(model_path)
  var_meta: dict[str, dict[str, Any]] = {}
  for code, meta in var_meta_raw.items():
    normalized = normalize_modbus_code(code)
    if not normalized:
      continue
    var_meta[normalized] = meta
  descriptions_raw = parse_var_descriptions(model_path)
  descriptions: dict[str, str] = {}
  for code, label in descriptions_raw.items():
    normalized = normalize_modbus_code(code)
    if not normalized:
      continue
    descriptions[normalized] = label
  length_by_code: dict[str, int | None] = {}
  try:
    entries = parse_modbus_map(model_path)
    for entry in entries:
      length = entry.get('length')
      for code in entry.get('codes', []) or []:
        normalized = normalize_modbus_code(code)
        if not normalized:
          continue
        if normalized not in length_by_code or length_by_code[normalized] is None:
          length_by_code[normalized] = length
  except Exception:  # noqa: BLE001
    pass
  metadata: dict[str, dict[str, Any]] = {}
  for code, meta in var_meta.items():
    metadata[code] = {
      'label': descriptions.get(code, code),
      'measure_unit': meta.get('measure_unit'),
      'decimals': meta.get('decimals'),
      'signed': meta.get('signed'),
      'length': length_by_code.get(code),
    }
  for code, label in descriptions.items():
    if code in metadata:
      continue
    metadata[code] = {
      'label': label,
      'measure_unit': var_meta.get(code, {}).get('measure_unit'),
      'decimals': var_meta.get(code, {}).get('decimals'),
      'signed': var_meta.get(code, {}).get('signed'),
      'length': length_by_code.get(code),
    }
  for code, length in length_by_code.items():
    if code in metadata:
      continue
    metadata[code] = {
      'label': code,
      'measure_unit': None,
      'decimals': None,
      'signed': None,
      'length': length,
    }
  model_metadata_cache[key] = metadata
  return metadata


def load_model_function_map(model_file: str | None) -> dict[str, int]:
  if not model_file:
    return {}
  key = model_file.strip().lower()
  cached = model_function_map_cache.get(key)
  if cached is not None:
    return cached
  mapping: dict[str, int] = {}
  try:
    model_path = resolve_model_path(model_file)
    entries = parse_modbus_map(model_path)
    for entry in entries:
      function_code = entry.get('function_code')
      if function_code is None:
        continue
      for code in entry.get('codes', []) or []:
        normalized = normalize_modbus_code(code)
        if not normalized:
          continue
        mapping[normalized] = int(function_code)
  except Exception as exc:  # noqa: BLE001
    logger.warning('Falha ao carregar function map do modelo %s: %s', model_file, exc)
    mapping = {}
  model_function_map_cache[key] = mapping
  return mapping


def load_model_code_index() -> dict[str, set[str]]:
  global model_code_index_cache
  if model_code_index_cache is not None:
    return model_code_index_cache
  index: dict[str, set[str]] = {}
  for model_file in list_device_model_files():
    try:
      metadata = load_model_metadata(model_file)
    except Exception:  # noqa: BLE001
      continue
    codes = {code for code in metadata.keys() if code}
    if codes:
      index[model_file] = codes
  model_code_index_cache = index
  return model_code_index_cache


def load_model_unique_codes() -> dict[str, set[str]]:
  global model_unique_code_cache
  if model_unique_code_cache is not None:
    return model_unique_code_cache
  index = load_model_code_index()
  counts: dict[str, int] = {}
  for codes in index.values():
    for code in codes:
      counts[code] = counts.get(code, 0) + 1
  unique_map: dict[str, set[str]] = {}
  for model_file, codes in index.items():
    unique_map[model_file] = {code for code in codes if counts.get(code, 0) == 1}
  model_unique_code_cache = unique_map
  return model_unique_code_cache


def guess_preferred_model_for_codes(codes: set[str]) -> str | None:
  if not codes:
    return None
  if len(codes & MPXPRO_HINT_CODES) < 2:
    return None
  device_models = list_device_model_files()
  model_map = {name.lower(): name for name in device_models}
  preferred = model_map.get(MPXPRO_PREFERRED_MODEL.lower())
  if preferred:
    return preferred
  return None


def guess_model_file_for_codes(codes: set[str], prefer_modbus: bool = False) -> str | None:
  if not codes:
    return None
  index = load_model_code_index()
  unique_index = load_model_unique_codes()
  if not index:
    return None
  best_file = None
  best_overlap = 0
  best_score = 0.0
  device_count = max(1, len(codes))
  for model_file, model_codes in unique_index.items():
    if not model_codes:
      continue
    result = score_model_for_codes(codes, model_file, model_codes, prefer_modbus)
    if not result:
      continue
    overlap, score = result
    if (
      overlap > best_overlap
      or (overlap == best_overlap and score > best_score)
      or (overlap == best_overlap and score == best_score and (best_file is None or model_file < best_file))
    ):
      best_file = model_file
      best_overlap = overlap
      best_score = score
  if best_file and best_overlap >= max(1, int(device_count * 0.1)):
    return best_file
  best_file = None
  best_overlap = 0
  best_score = 0.0
  for model_file, model_codes in index.items():
    if not model_codes:
      continue
    result = score_model_for_codes(codes, model_file, model_codes, prefer_modbus)
    if not result:
      continue
    overlap, score = result
    if (
      overlap > best_overlap
      or (overlap == best_overlap and score > best_score)
      or (overlap == best_overlap and score == best_score and (best_file is None or model_file < best_file))
    ):
      best_file = model_file
      best_overlap = overlap
      best_score = score
  min_overlap = max(2, int(device_count * 0.15))
  if best_overlap < min_overlap:
    return None
  if best_score < 0.1:
    return None
  return best_file


def load_code_metadata_index() -> dict[str, dict[str, Any]]:
  global code_metadata_cache
  if code_metadata_cache is not None:
    return code_metadata_cache
  code_metadata_cache = {}
  for model_file in list_device_model_files():
    try:
      metadata = load_model_metadata(model_file)
    except Exception:  # noqa: BLE001
      continue
    for code, meta in metadata.items():
      if not code or code in code_metadata_cache:
        continue
      code_metadata_cache[code] = {
        'label': meta.get('label') or code,
        'measure_unit': meta.get('measure_unit'),
        'decimals': meta.get('decimals'),
        'length': meta.get('length'),
      }
  return code_metadata_cache


def compute_address_in(function_code: int, offset: int) -> str:
  if function_code == 1:
    base = 100001
  elif function_code == 2:
    base = 200001
  elif function_code in (3, 4, 6, 16):
    base = 400001
  else:
    base = 0
  return str(base + int(offset))


def load_device_code_from_model(model_file: str | None) -> str | None:
  if not model_file:
    return None
  try:
    model_path = resolve_model_path(model_file)
    root = ET.parse(model_path).getroot()
    device_node = root.find('.//Device')
  except Exception:  # noqa: BLE001
    return None
  code = device_node.attrib.get('code') if device_node is not None else None
  if not code:
    return None
  return code.strip() or None


def parse_server_map_devices(server_map_file: str) -> list[dict[str, Any]]:
  model_path = resolve_model_path(server_map_file)
  root = ET.parse(model_path).getroot()
  if (root.tag or '').lower() != 'mbs_configuration':
    raise HTTPException(status_code=400, detail='XML informado nao e um server map valido')
  fallback_metadata = load_code_metadata_index()
  devices: list[dict[str, Any]] = []
  for device_node in root.findall('.//device'):
    addr_raw = device_node.attrib.get('addr')
    try:
      unit_id = int(addr_raw)
    except (TypeError, ValueError):
      continue
    name = (device_node.attrib.get('name') or f'Device {unit_id}').strip()
    raw_variables: list[dict[str, Any]] = []
    code_set: set[str] = set()
    for node in list(device_node):
      tag = (node.tag or '').lower()
      if tag not in ('reg', 'coil'):
        continue
      code = (node.attrib.get('code') or '').strip()
      normalized = normalize_modbus_code(code)
      if not normalized:
        continue
      addr = node.attrib.get('addr')
      try:
        offset = int(addr)
      except (TypeError, ValueError):
        continue
      function_code = 4 if tag == 'reg' else 1
      raw_variables.append({
        'code': code,
        'normalized': normalized,
        'function_code': function_code,
        'offset': offset,
      })
      code_set.add(normalized)
    model_ref = resolve_device_model_file(device_node)
    model_file = None
    model_source = None
    if model_ref:
      model_file = resolve_model_reference_to_file(model_ref, code_set, prefer_modbus=True)
      if model_file:
        model_source = 'server_map'
      else:
        logger.warning('Modelo informado no server map nao encontrado: %s', model_ref)
    if not model_file:
      preferred_model = guess_preferred_model_for_codes(code_set)
      if preferred_model:
        model_file = preferred_model
        model_source = 'heuristic'
    if not model_file:
      inferred_model = guess_model_file_for_codes(code_set, prefer_modbus=True)
      if inferred_model:
        logger.info('Modelo inferido para device %s: %s', unit_id, inferred_model)
        model_source = 'inferred'
      model_file = inferred_model
    if not model_file:
      logger.warning('Nenhum modelo identificado para device %s (codes=%s)', unit_id, len(code_set))
    if model_file:
      try:
        resolve_model_path(model_file)
      except HTTPException:
        logger.warning('Modelo XML nao encontrado para device %s: %s', unit_id, model_file)
        model_file = None
        model_source = None
    if model_file:
      logger.info(
        'Modelo selecionado para device %s (unit_id=%s, ref=%s, source=%s): %s',
        name,
        unit_id,
        model_ref or '-',
        model_source or 'unknown',
        model_file,
      )
    device_code = (device_node.attrib.get('code') or '').strip() or load_device_code_from_model(model_file)
    device_metadata: dict[str, dict[str, Any]] = {}
    model_function_map: dict[str, int] = {}
    is_mpxpro = is_mpxpro_device(model_file, code_set)
    if model_file:
      try:
        device_metadata = load_model_metadata(model_file)
        model_function_map = load_model_function_map(model_file)
      except Exception as exc:  # noqa: BLE001
        logger.warning('Falha ao carregar metadata do modelo %s: %s', model_file, exc)
        device_metadata = {}
        model_function_map = {}
    variables: list[dict[str, Any]] = []
    for raw in raw_variables:
      normalized = raw['normalized']
      meta = device_metadata.get(normalized) or fallback_metadata.get(normalized, {})
      length = int(meta.get('length') or 1)
      function_code = raw['function_code']
      offset = raw['offset']
      address_in = compute_address_in(function_code, offset)
      if is_mpxpro and normalized in MPXPRO_FLOAT_CODES and raw['function_code'] in (3, 4):
        length = 2
      mapped_function = model_function_map.get(normalized)
      if mapped_function is not None:
        function_code = mapped_function
      variables.append({
        'code': raw['code'],
        'label': meta.get('label') or raw['code'],
        'function_code': function_code,
        'offset': offset,
        'length': length,
        'address_in': address_in,
        'measure_unit': meta.get('measure_unit'),
        'decimals': meta.get('decimals'),
      })
    devices.append({
      'unit_id': unit_id,
      'name': name,
      'model_file': model_file,
      'device_code': device_code,
      'variables': variables,
    })
  return devices


def parse_server_map_devices_from_path(file_path: str) -> list[dict[str, Any]]:
  """Parse server map devices from a file path instead of using the Models directory"""
  root = ET.parse(file_path).getroot()
  if (root.tag or '').lower() != 'mbs_configuration':
    raise HTTPException(status_code=400, detail='XML informado nao e um server map valido')
  fallback_metadata = load_code_metadata_index()
  devices: list[dict[str, Any]] = []
  for device_node in root.findall('.//device'):
    addr_raw = device_node.attrib.get('addr')
    try:
      unit_id = int(addr_raw)
    except (TypeError, ValueError):
      continue
    name = (device_node.attrib.get('name') or f'Device {unit_id}').strip()
    raw_variables: list[dict[str, Any]] = []
    code_set: set[str] = set()
    for node in list(device_node):
      tag = (node.tag or '').lower()
      if tag not in ('reg', 'coil'):
        continue
      code = (node.attrib.get('code') or '').strip()
      normalized = normalize_modbus_code(code)
      if not normalized:
        continue
      addr = node.attrib.get('addr')
      try:
        offset = int(addr)
      except (TypeError, ValueError):
        continue
      function_code = 4 if tag == 'reg' else 1
      raw_variables.append({
        'code': code,
        'normalized': normalized,
        'function_code': function_code,
        'offset': offset,
      })
      code_set.add(normalized)
    model_ref = resolve_device_model_file(device_node)
    model_file = None
    model_source = None
    if model_ref:
      model_file = resolve_model_reference_to_file(model_ref, code_set, prefer_modbus=True)
      if model_file:
        model_source = 'server_map'
      else:
        logger.warning('Modelo informado no server map nao encontrado: %s', model_ref)
    if not model_file:
      preferred_model = guess_preferred_model_for_codes(code_set)
      if preferred_model:
        model_file = preferred_model
        model_source = 'heuristic'
    if not model_file:
      inferred_model = guess_model_file_for_codes(code_set, prefer_modbus=True)
      if inferred_model:
        logger.info('Modelo inferido para device %s: %s', unit_id, inferred_model)
        model_source = 'inferred'
      model_file = inferred_model
    if not model_file:
      logger.warning('Nenhum modelo identificado para device %s (codes=%s)', unit_id, len(code_set))
    if model_file:
      try:
        resolve_model_path(model_file)
      except HTTPException:
        logger.warning('Modelo XML nao encontrado para device %s: %s', unit_id, model_file)
        model_file = None
        model_source = None
    if model_file:
      logger.info(
        'Modelo selecionado para device %s (unit_id=%s, ref=%s, source=%s): %s',
        name,
        unit_id,
        model_ref or '-',
        model_source or 'unknown',
        model_file,
      )
    device_code = (device_node.attrib.get('code') or '').strip() or load_device_code_from_model(model_file)
    device_metadata: dict[str, dict[str, Any]] = {}
    model_function_map: dict[str, int] = {}
    is_mpxpro = is_mpxpro_device(model_file, code_set)
    if model_file:
      try:
        device_metadata = load_model_metadata(model_file)
        model_function_map = load_model_function_map(model_file)
      except Exception as exc:  # noqa: BLE001
        logger.warning('Falha ao carregar metadata do modelo %s: %s', model_file, exc)
        device_metadata = {}
        model_function_map = {}
    variables: list[dict[str, Any]] = []
    for raw in raw_variables:
      normalized = raw['normalized']
      meta = device_metadata.get(normalized) or fallback_metadata.get(normalized, {})
      length = int(meta.get('length') or 1)
      function_code = raw['function_code']
      offset = raw['offset']
      address_in = compute_address_in(function_code, offset)
      if is_mpxpro and normalized in MPXPRO_FLOAT_CODES and raw['function_code'] in (3, 4):
        length = 2
      mapped_function = model_function_map.get(normalized)
      if mapped_function is not None:
        function_code = mapped_function
      variables.append({
        'code': raw['code'],
        'label': meta.get('label') or raw['code'],
        'function_code': function_code,
        'offset': offset,
        'length': length,
        'address_in': address_in,
        'measure_unit': meta.get('measure_unit'),
        'decimals': meta.get('decimals'),
      })
    devices.append({
      'unit_id': unit_id,
      'name': name,
      'model_file': model_file,
      'device_code': device_code,
      'variables': variables,
    })
  return devices


def insert_audit_log(action: str, entity: str | None = None, metadata: dict[str, Any] | None = None) -> None:
  execute(
    'INSERT INTO audit_log (user_id, action, entity, metadata) VALUES (%s, %s, %s, %s)',
    (None, action, entity, json.dumps(metadata or {})),
  )


CLEAR_DB_TABLES = [
  'telemetry',
  'device_readings',
  'device_mini_graph_variables',
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


def ensure_runtime_selection_tables() -> None:
  execute(
    (
      'CREATE TABLE IF NOT EXISTS device_mini_graph_variables ('
      'id BIGINT PRIMARY KEY AUTO_INCREMENT, '
      'device_id BIGINT NOT NULL, '
      'variable_id BIGINT NOT NULL, '
      'display_order INT DEFAULT 0, '
      'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, '
      'FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE, '
      'FOREIGN KEY (variable_id) REFERENCES device_variables(id) ON DELETE CASCADE'
      ')'
    )
  )
  has_index = query(
    (
      'SELECT 1 FROM information_schema.statistics '
      "WHERE table_schema = DATABASE() AND table_name = 'device_mini_graph_variables' "
      "AND index_name = 'idx_mini_graph_variables_device' LIMIT 1"
    )
  )
  if not has_index:
    execute('ALTER TABLE device_mini_graph_variables ADD INDEX idx_mini_graph_variables_device (device_id)')


def ensure_runtime_plant_columns() -> None:
  has_server_map_column = query(
    (
      'SELECT 1 FROM information_schema.columns '
      "WHERE table_schema = DATABASE() AND table_name = 'plants' "
      "AND column_name = 'server_map_file' LIMIT 1"
    )
  )
  if not has_server_map_column:
    execute('ALTER TABLE plants ADD COLUMN server_map_file VARCHAR(200) NULL AFTER hostname')


def clear_database_data() -> None:
  pool = get_pool()
  if pool is None:
    return
  conn = None
  cursor = None
  try:
    conn = pool.get_connection()
    cursor = conn.cursor()
    cursor.execute('SET FOREIGN_KEY_CHECKS=0')
    for table in CLEAR_DB_TABLES:
      try:
        cursor.execute(f'TRUNCATE TABLE {table}')
      except Exception as exc:  # noqa: BLE001
        logger.warning('Nao foi possivel limpar %s: %s', table, exc)
    cursor.execute('SET FOREIGN_KEY_CHECKS=1')
    conn.commit()
  except Exception as exc:  # noqa: BLE001
    logger.warning('Falha ao limpar dados do banco: %s', exc)
  finally:
    if cursor:
      cursor.close()
    if conn:
      conn.close()


def clear_runtime_caches() -> None:
  global server_modbus_map_cache, model_code_index_cache, model_unique_code_cache, model_device_code_index_cache
  global code_metadata_cache, model_metadata_cache, model_protocol_cache, model_dashboard_defaults_cache
  global model_function_map_cache
  scan_sessions_cache.clear()
  scan_results_cache.clear()
  scan_logs_cache.clear()
  scan_progress_cache.clear()
  scan_summary_cache.clear()
  scan_cancel_events.clear()
  plants_cache.clear()
  devices_cache.clear()
  device_variables_cache.clear()
  latest_telemetry_cache.clear()
  server_modbus_map_cache = {}
  model_code_index_cache = None
  model_unique_code_cache = None
  model_device_code_index_cache = None
  code_metadata_cache = None
  model_metadata_cache = {}
  model_protocol_cache = {}
  model_dashboard_defaults_cache = {}
  model_function_map_cache = {}


def resolve_model_path(model_file: str) -> str:
  safe_name = os.path.basename(model_file).strip()
  if not safe_name:
    raise HTTPException(status_code=404, detail='Modelo XML nao encontrado')
  available = list_model_files()
  if safe_name not in available:
    lowered = safe_name.lower()
    match = next((name for name in available if name.lower() == lowered), None)
    if match:
      safe_name = match
    else:
      raise HTTPException(status_code=404, detail='Modelo XML nao encontrado')
  return os.path.abspath(os.path.join(get_models_dir(), safe_name))


def should_swap_words(model_file: str | None) -> bool:
  if not model_file:
    return False
  key = model_file.strip().lower()
  cached = model_word_swap_cache.get(key)
  if cached is not None:
    return cached
  try:
    model_path = resolve_model_path(model_file)
    tree = ET.parse(model_path)
    device_node = tree.getroot().find('.//Device')
    little_endian = device_node.attrib.get('littleEndian') if device_node is not None else None
    swap = str(little_endian) == '0'
  except Exception:  # noqa: BLE001
    swap = False
  model_word_swap_cache[key] = swap
  return swap


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


def normalize_modbus_code(code: str | None) -> str | None:
  if not code:
    return None
  return code.strip().lower()


def normalize_read_priority(value: str | None) -> Literal['fast', 'medium', 'slow'] | None:
  if not value:
    return None
  normalized = value.strip().lower()
  if normalized in {'fast', 'medium', 'slow'}:
    return normalized  # type: ignore[return-value]
  return None


def resolve_variable_priority(variable: dict[str, Any]) -> Literal['fast', 'medium', 'slow']:
  code = normalize_modbus_code(variable.get('code')) or ''
  function_code = int(variable.get('function_code') or 0)

  if any(token in code for token in FAST_PRIORITY_HINTS):
    return 'fast'
  if any(token in code for token in SLOW_PRIORITY_HINTS):
    return 'slow'
  if any(token in code for token in MEDIUM_PRIORITY_HINTS):
    return 'medium'

  if function_code in (1, 2):
    return 'medium'
  if function_code in (3, 4):
    return 'medium'
  return 'slow'


def filter_variables_for_priority(
  variables: list[dict[str, Any]],
  priority: Literal['fast', 'medium', 'slow'] | None,
) -> list[dict[str, Any]]:
  if not priority:
    return variables
  return [variable for variable in variables if resolve_variable_priority(variable) == priority]


def parse_server_modbus_map(model_path: str) -> dict[int, dict[str, dict[str, Any]]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  mapping: dict[int, dict[str, dict[str, Any]]] = {}
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
      normalized = normalize_modbus_code(code)
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
        'function_code': function_code,
        'code': code,
        'tag': tag,
      }
  return mapping


def load_server_modbus_map_for_file(server_map_file: str | None) -> dict[int, dict[str, dict[str, Any]]]:
  normalized = normalize_model_reference(server_map_file)
  if not normalized:
    return {}
  cache_key = normalized.lower()
  cached = server_modbus_map_cache.get(cache_key)
  if cached is not None:
    return cached
  try:
    model_path = resolve_model_path(normalized)
  except HTTPException:
    logger.warning('Modelo XML do servidor Modbus nao encontrado: %s', normalized)
    server_modbus_map_cache[cache_key] = {}
    return server_modbus_map_cache[cache_key]
  try:
    parsed = parse_server_modbus_map(model_path)
  except Exception as exc:  # noqa: BLE001
    logger.warning('Falha ao carregar mapa do servidor Modbus %s: %s', normalized, exc)
    parsed = {}
  server_modbus_map_cache[cache_key] = parsed
  return parsed


def get_plant_server_map_file(plant_id: int | None) -> str | None:
  if plant_id is None:
    return settings.modbus_server_map_file
  rows = query('SELECT server_map_file FROM plants WHERE id = %s LIMIT 1', (plant_id,))
  if rows:
    value = (rows[0].get('server_map_file') or '').strip()
    if value:
      return value
  cached = plants_cache.get(int(plant_id))
  if cached:
    cached_value = (cached.get('server_map_file') or '').strip()
    if cached_value:
      return cached_value
  return settings.modbus_server_map_file


def load_server_modbus_map_for_plant(plant_id: int | None) -> dict[int, dict[str, dict[str, Any]]]:
  server_map_file = get_plant_server_map_file(plant_id)
  return load_server_modbus_map_for_file(server_map_file)


def load_server_modbus_map() -> dict[int, dict[str, dict[str, Any]]]:
  return load_server_modbus_map_for_file(settings.modbus_server_map_file)


def parse_modbus_map(model_path: str, length_map: dict[int, int] | None = None) -> list[dict[str, Any]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  modbus_vars = root.find('.//Protos/Modbus/Vars')
  carel_vars = root.find('.//Protos/Carel/Vars')
  if modbus_vars is None and carel_vars is None:
    return []
  var_meta = parse_var_metadata(model_path)
  entries: dict[tuple[int, int, int], dict[str, Any]] = {}
  def add_entry(func_type: int, address_in: str, var_node: Any) -> None:
    offset = address_to_offset(address_in)
    if offset is None or func_type <= 0:
      return
    var_dimension = int(var_node.attrib.get('varDimension', '0') or 0)
    var_length = int(var_node.attrib.get('varLength', '0') or 0)
    length = 1
    if func_type in (3, 4) and max(var_dimension, var_length) > 16:
      length = 2
    length = resolve_length(func_type, length, length_map)
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
      entry['codes'].append(code)
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


def parse_modbus_write_map(model_path: str, length_map: dict[int, int] | None = None) -> dict[str, dict[str, Any]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  modbus_vars = root.find('.//Protos/Modbus/Vars')
  carel_vars = root.find('.//Protos/Carel/Vars')
  if modbus_vars is None and carel_vars is None:
    return {}
  var_meta = parse_var_metadata(model_path)
  entries: dict[str, dict[str, Any]] = {}

  def add_entry(code: str | None, func_type: int, address_out: str, var_node: Any) -> None:
    if not code:
      return
    offset = address_to_offset(address_out)
    if offset is None or func_type <= 0:
      return
    var_dimension = int(var_node.attrib.get('varDimension', '0') or 0)
    var_length = int(var_node.attrib.get('varLength', '0') or 0)
    length = 1
    if func_type in (3, 4, 6, 16) and max(var_dimension, var_length) > 16:
      length = 2
    length = resolve_length(func_type, length, length_map)
    meta = var_meta.get(code, {})
    entries[code] = {
      'function_code': func_type,
      'offset': offset,
      'length': length,
      'address_out': address_out,
      'measure_unit': meta.get('measure_unit'),
      'decimals': meta.get('decimals'),
      'signed': meta.get('signed'),
    }

  if modbus_vars is not None:
    for var_node in modbus_vars.findall('VarMDB'):
      code = var_node.attrib.get('code')
      func_type = int(var_node.attrib.get('funcTypeWrite', '0') or 0)
      address_out = var_node.attrib.get('addressOut', '') or ''
      add_entry(code, func_type, address_out, var_node)

    for var_node in modbus_vars.findall('VarCRL'):
      bit_position = int(var_node.attrib.get('bitPosition', '0') or 0)
      if bit_position != 0:
        continue
      code = var_node.attrib.get('code')
      address_out = var_node.attrib.get('addressOut', '') or ''
      var_dimension = int(var_node.attrib.get('varDimension', '0') or 0)
      var_length = int(var_node.attrib.get('varLength', '0') or 0)
      length = 1
      if max(var_dimension, var_length) > 16:
        length = 2
      func_type = 6 if length <= 1 else 16
      add_entry(code, func_type, address_out, var_node)

  if carel_vars is not None:
    for var_node in carel_vars.findall('VarCRL'):
      bit_position = int(var_node.attrib.get('bitPosition', '0') or 0)
      if bit_position != 0:
        continue
      code = var_node.attrib.get('code')
      address_out = var_node.attrib.get('addressOut', '') or ''
      var_dimension = int(var_node.attrib.get('varDimension', '0') or 0)
      var_length = int(var_node.attrib.get('varLength', '0') or 0)
      length = 1
      if max(var_dimension, var_length) > 16:
        length = 2
      func_type = 6 if length <= 1 else 16
      add_entry(code, func_type, address_out, var_node)
  return entries


def parse_model_info(model_path: str, length_map: dict[int, int] | None = None) -> tuple[str | None, list[dict[str, Any]]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  device_node = root.find('.//Device')
  device_code = device_node.attrib.get('code') if device_node is not None else None
  entries = parse_modbus_map(model_path, length_map)
  return device_code, entries


def parse_var_descriptions(model_path: str) -> dict[str, str]:
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


def parse_model_dashboard_defaults(model_path: str) -> list[str]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  items: list[tuple[int, int, str]] = []
  for idx, node in enumerate(root.findall('.//PVVar')):
    to_display = (node.attrib.get('toDisplay') or '').strip().lower()
    if to_display != 'home':
      continue
    code = node.attrib.get('code')
    normalized = normalize_modbus_code(code)
    if not normalized:
      continue
    priority_raw = (node.attrib.get('priority') or '').strip()
    try:
      priority = int(priority_raw) if priority_raw else 9999
    except ValueError:
      priority = 9999
    items.append((priority, idx, normalized))
  items.sort()
  defaults: list[str] = []
  seen: set[str] = set()
  for _, _, code in items:
    if code in seen:
      continue
    seen.add(code)
    defaults.append(code)
  return defaults


def load_model_dashboard_defaults(model_file: str | None) -> list[str]:
  if not model_file:
    return []
  key = model_file.strip().lower()
  cached = model_dashboard_defaults_cache.get(key)
  if cached is not None:
    return cached
  try:
    model_path = resolve_model_path(model_file)
    defaults = parse_model_dashboard_defaults(model_path)
  except Exception as exc:  # noqa: BLE001
    logger.warning('Falha ao carregar defaults de dashboard do modelo %s: %s', model_file, exc)
    defaults = []
  model_dashboard_defaults_cache[key] = defaults
  return defaults


def get_or_create_plant(
  name: str,
  hostname: str,
  plant_id: int | None = None,
  server_map_file: str | None = None,
  reuse_by_hostname: bool = True,
) -> int:
  normalized_server_map = normalize_model_reference(server_map_file) if server_map_file else None
  if plant_id is not None:
    rows = query('SELECT id FROM plants WHERE id = %s LIMIT 1', (plant_id,))
    if rows:
      update_fields = ['name = %s', 'hostname = %s']
      update_params: list[Any] = [name, hostname]
      if normalized_server_map is not None:
        update_fields.append('server_map_file = %s')
        update_params.append(normalized_server_map)
      update_params.append(plant_id)
      execute(f'UPDATE plants SET {", ".join(update_fields)} WHERE id = %s', tuple(update_params))
      return int(rows[0]['id'])
  if reuse_by_hostname:
    rows = query('SELECT id FROM plants WHERE hostname = %s LIMIT 1', (hostname,))
    if rows:
      update_fields = ['name = %s']
      update_params: list[Any] = [name]
      if normalized_server_map is not None:
        update_fields.append('server_map_file = %s')
        update_params.append(normalized_server_map)
      update_params.append(rows[0]['id'])
      execute(f'UPDATE plants SET {", ".join(update_fields)} WHERE id = %s', tuple(update_params))
      return int(rows[0]['id'])
  plant_id = execute(
    'INSERT INTO plants (name, status, vpn_tunnel, hostname, server_map_file) VALUES (%s, %s, %s, %s, %s)',
    (name, 'online', 'Ativo', hostname, normalized_server_map),
  )
  if plant_id is None:
    cache_id = int(datetime.utcnow().timestamp() * 1000)
    plants_cache[cache_id] = {
      'id': cache_id,
      'name': name,
      'status': 'online',
      'vpn_tunnel': 'Ativo',
      'hostname': hostname,
      'server_map_file': normalized_server_map,
    }
    return cache_id
  return int(plant_id)


def insert_device(plant_id: int, name: str, unit_id: int, device_code: str | None, model_file: str | None) -> int:
  device_id = execute(
    (
      'INSERT INTO devices (plant_id, name, modbus_id, family_code, alarm_active, last_seen_at, model_file, device_code) '
      'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'
    ),
    (plant_id, name, unit_id, device_code, False, datetime.utcnow(), model_file, device_code),
  )
  if device_id is None:
    cache_id = int(datetime.utcnow().timestamp() * 1000)
    devices_cache[cache_id] = {
      'id': cache_id,
      'plant_id': plant_id,
      'name': name,
      'modbus_id': unit_id,
      'family_code': device_code,
      'model_file': model_file,
      'device_code': device_code,
      'alarm_active': False,
      'last_seen_at': datetime.utcnow().isoformat(),
    }
    return cache_id
  return int(device_id)


def get_or_create_device(plant_id: int, name: str, unit_id: int, device_code: str | None, model_file: str | None) -> int:
  rows = query(
    'SELECT id FROM devices WHERE plant_id = %s AND modbus_id = %s LIMIT 1',
    (plant_id, unit_id),
  )
  if rows:
    return int(rows[0]['id'])
  return insert_device(plant_id, name, unit_id, device_code, model_file)


def device_exists(plant_id: int, unit_id: int) -> bool:
  rows = query(
    'SELECT id FROM devices WHERE plant_id = %s AND modbus_id = %s LIMIT 1',
    (plant_id, unit_id),
  )
  return bool(rows)


def get_device_id(plant_id: int, unit_id: int) -> int | None:
  rows = query(
    'SELECT id FROM devices WHERE plant_id = %s AND modbus_id = %s LIMIT 1',
    (plant_id, unit_id),
  )
  if rows:
    return int(rows[0]['id'])
  return None


def insert_device_variables(device_id: int, entries: list[dict[str, Any]], descriptions: dict[str, str]) -> None:
  rows: list[tuple[Any, ...]] = []
  cache_rows: list[dict[str, Any]] = []
  device_map: dict[str, dict[str, Any]] | None = None
  device_rows = query('SELECT plant_id, modbus_id FROM devices WHERE id = %s', (device_id,))
  if not device_rows and device_id in devices_cache:
    cached_device = devices_cache[device_id]
    plant_id_cached = cached_device.get('plant_id')
    modbus_id_cached = cached_device.get('modbus_id')
    if plant_id_cached is not None and modbus_id_cached is not None:
      device_rows = [{'plant_id': plant_id_cached, 'modbus_id': modbus_id_cached}]
  if device_rows:
    plant_id = int(device_rows[0]['plant_id'])
    server_map = load_server_modbus_map_for_plant(plant_id)
    if server_map:
      device_map = server_map.get(int(device_rows[0]['modbus_id']))
  if device_map is None:
    server_map = load_server_modbus_map()
    if server_map:
      fallback_rows = query('SELECT modbus_id FROM devices WHERE id = %s', (device_id,))
      if not fallback_rows and device_id in devices_cache:
        fallback_rows = [{'modbus_id': devices_cache[device_id].get('modbus_id')}]
      if fallback_rows and fallback_rows[0].get('modbus_id') is not None:
        device_map = server_map.get(int(fallback_rows[0]['modbus_id']))
  for entry in entries:
    for code in entry.get('codes', []) or []:
      function_code = entry.get('function_code')
      offset = entry.get('offset')
      address_in = entry.get('address_in')
      normalized = normalize_modbus_code(code)
      if device_map and normalized:
        override = device_map.get(normalized)
        if override:
          offset = override.get('offset', offset)
          address_in = override.get('address_in', address_in)
          override_function = override.get('function_code')
          if override_function is not None:
            function_code = override_function
      if function_code is not None:
        function_code = int(function_code)
      label = descriptions.get(code, code)
      rows.append((
        device_id,
        code,
        label,
        function_code,
        offset,
        entry.get('length'),
        address_in,
        entry.get('measure_unit'),
        entry.get('decimals'),
      ))
      cache_rows.append({
        'id': len(device_variables_cache.get(device_id, [])) + len(cache_rows) + 1,
        'device_id': device_id,
        'code': code,
        'label': label,
        'function_code': function_code,
        'offset': offset,
        'length': entry.get('length'),
        'address_in': address_in,
        'measure_unit': entry.get('measure_unit'),
        'decimals': entry.get('decimals'),
      })
  if not rows:
    return
  result = execute(
    (
      'INSERT INTO device_variables '
      '(device_id, code, label, function_code, offset, length, address_in, measure_unit, decimals) '
      'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
    ),
    rows,
    many=True,
  )
  if result is None:
    device_variables_cache.setdefault(device_id, []).extend(cache_rows)


def insert_server_device_variables(device_id: int, variables: list[dict[str, Any]]) -> None:
  rows: list[tuple[Any, ...]] = []
  cache_rows: list[dict[str, Any]] = []
  for variable in variables:
    rows.append((
      device_id,
      variable.get('code'),
      variable.get('label'),
      variable.get('function_code'),
      variable.get('offset'),
      variable.get('length'),
      variable.get('address_in'),
      variable.get('measure_unit'),
      variable.get('decimals'),
    ))
    cache_rows.append({
      'id': len(device_variables_cache.get(device_id, [])) + len(cache_rows) + 1,
      'device_id': device_id,
      'code': variable.get('code'),
      'label': variable.get('label'),
      'function_code': variable.get('function_code'),
      'offset': variable.get('offset'),
      'length': variable.get('length'),
      'address_in': variable.get('address_in'),
      'measure_unit': variable.get('measure_unit'),
      'decimals': variable.get('decimals'),
    })
  if not rows:
    return
  result = execute(
    (
      'INSERT INTO device_variables '
      '(device_id, code, label, function_code, offset, length, address_in, measure_unit, decimals) '
      'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
    ),
    rows,
    many=True,
  )
  if result is None:
    device_variables_cache.setdefault(device_id, []).extend(cache_rows)


def apply_dashboard_defaults_for_device(device_id: int, model_file: str | None) -> None:
  default_codes = load_model_dashboard_defaults(model_file)
  if not default_codes:
    return
  existing = query(
    'SELECT 1 FROM device_dashboard_variables WHERE device_id = %s LIMIT 1',
    (device_id,),
  )
  if existing:
    return
  vars_rows = query(
    'SELECT id, code FROM device_variables WHERE device_id = %s ORDER BY id ASC',
    (device_id,),
  )
  if not vars_rows and device_id in device_variables_cache:
    vars_rows = device_variables_cache[device_id]
  if not vars_rows:
    return
  code_to_id: dict[str, int] = {}
  for row in vars_rows:
    code = row.get('code')
    if not code:
      continue
    normalized = normalize_modbus_code(code)
    if not normalized or normalized in code_to_id:
      continue
    try:
      code_to_id[normalized] = int(row.get('id'))
    except (TypeError, ValueError):
      continue
  variable_ids: list[int] = []
  for code in default_codes:
    var_id = code_to_id.get(code)
    if var_id:
      variable_ids.append(var_id)
    if len(variable_ids) >= 5:
      break
  if not variable_ids:
    return
  rows_to_insert = [(device_id, var_id, index) for index, var_id in enumerate(variable_ids)]
  execute(
    'INSERT INTO device_dashboard_variables (device_id, variable_id, display_order) VALUES (%s, %s, %s)',
    rows_to_insert,
    many=True,
  )
  existing_mini = query(
    'SELECT 1 FROM device_mini_graph_variables WHERE device_id = %s LIMIT 1',
    (device_id,),
  )
  if not existing_mini:
    mini_rows = [(device_id, var_id, index) for index, var_id in enumerate(variable_ids[:3])]
    execute(
      'INSERT INTO device_mini_graph_variables (device_id, variable_id, display_order) VALUES (%s, %s, %s)',
      mini_rows,
      many=True,
    )


def delete_device_variables(device_id: int) -> None:
  execute('DELETE FROM device_variables WHERE device_id = %s', (device_id,))
  device_variables_cache.pop(device_id, None)


def upsert_device_asset(device_id: int, model_file: str | None, device_code: str | None) -> None:
  image_key, image_path = resolve_device_image(model_file, device_code)
  execute('DELETE FROM device_assets WHERE device_id = %s', (device_id,))
  execute(
    'INSERT INTO device_assets (device_id, model_file, image_key, image_path) VALUES (%s, %s, %s, %s)',
    (device_id, model_file, image_key, image_path),
  )


def parse_var_metadata(model_path: str) -> dict[str, dict[str, Any]]:
  tree = ET.parse(model_path)
  root = tree.getroot()
  metadata: dict[str, dict[str, Any]] = {}
  for var_node in root.findall('.//Vars/Var'):
    code = var_node.attrib.get('code')
    if not code:
      continue
    decimals = var_node.attrib.get('decimal')
    try:
      decimals_value = int(decimals) if decimals is not None and decimals != '' else None
    except ValueError:
      decimals_value = None
    signed_raw = (var_node.attrib.get('signed') or '').strip().lower()
    if signed_raw in {'true', '1', 'yes'}:
      signed_value: bool | None = True
    elif signed_raw in {'false', '0', 'no'}:
      signed_value = False
    else:
      signed_value = None
    metadata[code] = {
      'measure_unit': var_node.attrib.get('measureUnit') or None,
      'decimals': decimals_value,
      'signed': signed_value,
    }
  return metadata


def insert_scan_session(protocol: str, config: dict[str, Any]) -> int:
  now = datetime.utcnow()
  session_id = execute(
    'INSERT INTO scan_sessions (protocol, status, config, started_at) VALUES (%s, %s, %s, %s)',
    (protocol, 'running', json.dumps(config), now),
  )
  if session_id is None:
    session_id = int(now.timestamp() * 1000)
    scan_sessions_cache[session_id] = {
      'id': session_id,
      'protocol': protocol,
      'status': 'running',
      'config': config,
      'started_at': now.isoformat(),
      'finished_at': None,
      'total_results': 0,
    }
  return session_id


def finalize_scan_session(session_id: int, total_results: int, status: str = 'finished') -> None:
  now = datetime.utcnow()
  updated = execute(
    'UPDATE scan_sessions SET status = %s, finished_at = %s, total_results = %s WHERE id = %s',
    (status, now, total_results, session_id),
  )
  if updated is None and session_id in scan_sessions_cache:
    scan_sessions_cache[session_id]['status'] = status
    scan_sessions_cache[session_id]['finished_at'] = now.isoformat()
    scan_sessions_cache[session_id]['total_results'] = total_results


def insert_scan_result(session_id: int, result: dict[str, Any]) -> int | None:
  result_id = execute(
    (
      'INSERT INTO scan_results '
      '(session_id, connection, ip, port, unit_id, function_code, offset, length, status, response_ms, error, registers, created_at) '
      'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
    ),
    (
      session_id,
      result.get('connection'),
      result.get('ip'),
      result.get('port'),
      result.get('unit_id'),
      result.get('function_code'),
      result.get('offset'),
      result.get('length'),
      result.get('status'),
      result.get('response_ms'),
      result.get('error'),
      json.dumps(result.get('registers')) if result.get('registers') is not None else None,
      datetime.utcnow(),
    ),
  )
  if result_id is None:
    new_id = len(scan_results_cache.get(session_id, [])) + 1
    scan_results_cache.setdefault(session_id, []).append({**result, 'id': new_id})
    return new_id
  return result_id


def insert_scan_log(session_id: int, level: str, message: str, metadata: dict[str, Any] | None = None) -> None:
  log_id = execute(
    'INSERT INTO scan_logs (session_id, level, message, metadata) VALUES (%s, %s, %s, %s)',
    (session_id, level, message, json.dumps(metadata or {})),
  )
  if log_id is None:
    scan_logs_cache.setdefault(session_id, []).append({
      'id': len(scan_logs_cache.get(session_id, [])) + 1,
      'session_id': session_id,
      'level': level,
      'message': message,
      'metadata': metadata or {},
      'created_at': datetime.utcnow().isoformat(),
    })


@app.get('/health')
def health():
  return {"status": "ok", "service": "kryos-backend", "time": datetime.utcnow().isoformat()}


@app.get('/api/system/readiness')
def system_readiness():
  service_time = datetime.utcnow().isoformat()
  pool = get_pool()
  if pool is None:
    return {
      'db_ready': False,
      'service': 'kryos-backend',
      'time': service_time,
      'reason': 'pool_unavailable',
    }
  conn = None
  cursor = None
  started = perf_counter()
  try:
    conn = pool.get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT 1')
    row = cursor.fetchone()
    db_ready = bool(row and int(row[0]) == 1)
    return {
      'db_ready': db_ready,
      'service': 'kryos-backend',
      'time': service_time,
      'db_ping_ms': round((perf_counter() - started) * 1000, 2),
    }
  except Exception as exc:  # noqa: BLE001
    logger.warning('Readiness falhou ao validar o banco: %s', exc)
    return {
      'db_ready': False,
      'service': 'kryos-backend',
      'time': service_time,
      'db_ping_ms': round((perf_counter() - started) * 1000, 2),
      'reason': 'db_probe_failed',
    }
  finally:
    if cursor:
      cursor.close()
    if conn:
      conn.close()


@app.post('/api/auth/login', response_model=LoginResponse)
def login(body: LoginRequest):
  rows = query('SELECT id, name, role, email FROM users WHERE email = %s LIMIT 1', (body.email,))
  if not rows:
    # Demo fallback user
    demo_user = {"id": 1, "name": "Cliente Demo", "role": "cliente", "email": body.email}
    return {"token": "demo-token", "user": demo_user}
  user = rows[0]
  return {"token": "mock-jwt-token", "user": user}


@app.websocket('/ws/devices/{device_id}/telemetry')
async def device_telemetry_ws(websocket: WebSocket, device_id: int):
  await websocket.accept()
  last_payload = None
  try:
    while True:
      rows = get_latest_telemetry_cache(device_id)
      if not rows:
        rows = await asyncio.to_thread(fetch_latest_telemetry, device_id)
      payload = {'device_id': device_id, 'readings': rows}
      encoded = jsonable_encoder(payload)
      if encoded != last_payload:
        await websocket.send_json(encoded)
        last_payload = encoded
      await asyncio.sleep(WS_TELEMETRY_PUSH_INTERVAL_SECONDS)
  except WebSocketDisconnect:
    return
  except Exception as exc:  # noqa: BLE001
    logger.warning('WebSocket erro device %s: %s', device_id, exc)
    try:
      await websocket.close()
    except Exception:  # noqa: BLE001
      pass


@app.get('/api/plants')
def list_plants():
  rows = query('SELECT id, name, status, vpn_tunnel, hostname, server_map_file FROM plants ORDER BY name ASC')
  if rows:
    return {"data": rows}
  if plants_cache:
    return {"data": list(plants_cache.values())}
  return {"data": fallback_plants}


@app.get('/api/plants/{plant_id}/devices')
def list_devices(plant_id: int):
  rows = query(
    (
      'SELECT id, name, modbus_id, family_code, model_file, device_code, alarm_active, last_seen_at '
      'FROM devices WHERE plant_id = %s'
    ),
    (plant_id,),
  )
  if rows:
    return {"data": rows}
  cached = [device for device in devices_cache.values() if device.get('plant_id') == plant_id]
  if cached:
    return {"data": cached}
  return {"data": fallback_devices.get(plant_id, [])}


@app.get('/api/plants/{plant_id}/alarms')
def list_alarms(plant_id: int):
  rows = query('SELECT id, device_id, code, description, severity, opened_at, acknowledged_at FROM alarms WHERE plant_id = %s ORDER BY opened_at DESC LIMIT 50', (plant_id,))
  return {"data": rows or fallback_alarms.get(plant_id, [])}


@app.get('/api/telemetry/overview')
def telemetry_overview(
  plant_id: int | None = Query(default=None),
  window_minutes: int = Query(default=15, ge=1, le=1440),
):
  db_ready = get_pool() is not None
  server_time = datetime.utcnow().isoformat()
  if not db_ready:
    data = []
    for device in devices_cache.values():
      if plant_id is not None and device.get('plant_id') != plant_id:
        continue
      data.append({
        'device_id': device.get('id'),
        'device_name': device.get('name'),
        'plant_id': device.get('plant_id'),
        'model_file': device.get('model_file'),
        'family_code': device.get('family_code'),
        'device_code': device.get('device_code'),
        'last_seen_at': device.get('last_seen_at'),
        'last_telemetry_at': None,
        'telemetry_total': 0,
        'telemetry_window': 0,
      })
    return {
      'db_ready': False,
      'window_minutes': window_minutes,
      'server_time': server_time,
      'data': data,
    }

  window_start = datetime.utcnow() - timedelta(minutes=int(window_minutes))
  params: list[Any] = [window_start]
  where_clause = ''
  if plant_id is not None:
    where_clause = 'WHERE d.plant_id = %s '
    params.append(plant_id)
  rows = query(
    (
      'SELECT d.id AS device_id, d.name AS device_name, d.plant_id, '
      'd.model_file, d.family_code, d.device_code, d.last_seen_at, '
      'MAX(t.captured_at) AS last_telemetry_at, '
      'COUNT(t.id) AS telemetry_total, '
      'COALESCE(SUM(CASE WHEN t.captured_at >= %s THEN 1 ELSE 0 END), 0) AS telemetry_window '
      'FROM devices d '
      'LEFT JOIN telemetry t ON t.device_id = d.id '
      f'{where_clause}'
      'GROUP BY d.id, d.name, d.plant_id, d.model_file, d.family_code, d.device_code, d.last_seen_at '
      'ORDER BY d.plant_id ASC, d.id ASC'
    ),
    tuple(params),
  )
  if not rows and devices_cache:
    data = []
    for device in devices_cache.values():
      if plant_id is not None and device.get('plant_id') != plant_id:
        continue
      data.append({
        'device_id': device.get('id'),
        'device_name': device.get('name'),
        'plant_id': device.get('plant_id'),
        'model_file': device.get('model_file'),
        'family_code': device.get('family_code'),
        'device_code': device.get('device_code'),
        'last_seen_at': device.get('last_seen_at'),
        'last_telemetry_at': None,
        'telemetry_total': 0,
        'telemetry_window': 0,
      })
    rows = data
  return {
    'db_ready': True,
    'window_minutes': window_minutes,
    'server_time': server_time,
    'data': rows or [],
  }


@app.get('/api/models')
def list_models():
  return {"data": list_device_model_files()}


@app.get('/api/server-maps')
def list_server_maps():
  return {"data": list_server_map_files()}


class ServerMapScanRequest(BaseModel):
  host: str
  port: int = 502
  server_map_file: str
  plant_name: str
  plant_id: int | None = None

  @field_validator('host')
  @classmethod
  def validate_host(cls, value):  # noqa: ANN001
    if not value or not value.strip():
      raise ValueError('host obrigatorio')
    return value.strip()

  @field_validator('server_map_file')
  @classmethod
  def validate_server_map(cls, value):  # noqa: ANN001
    if not value or not value.strip():
      raise ValueError('server_map_file obrigatorio')
    return value.strip()


def persist_uploaded_server_map_file(filename: str | None, content: bytes) -> str:
  normalized = normalize_model_reference(filename) or 'server_map_upload.xml'
  base_name, ext = os.path.splitext(normalized)
  if not ext:
    ext = '.xml'
  timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
  safe_base = base_name or 'server_map_upload'
  target_name = f'{safe_base}_{timestamp}{ext}'
  models_dir = os.path.abspath(get_models_dir())
  os.makedirs(models_dir, exist_ok=True)
  target_path = os.path.join(models_dir, target_name)
  suffix = 1
  while os.path.exists(target_path):
    target_name = f'{safe_base}_{timestamp}_{suffix}{ext}'
    target_path = os.path.join(models_dir, target_name)
    suffix += 1
  with open(target_path, 'wb') as fp:
    fp.write(content)
  server_modbus_map_cache.pop(target_name.lower(), None)
  return target_name


def upsert_server_map_devices_for_plant(plant_id: int, devices: list[dict[str, Any]]) -> list[dict[str, Any]]:
  created: list[dict[str, Any]] = []
  for device in devices:
    unit_id = int(device['unit_id'])
    device_name = str(device['name'] or f'Device {unit_id}')
    model_file = device.get('model_file')
    device_code = device.get('device_code') or device_name
    existing_id = get_device_id(plant_id, unit_id)
    if existing_id:
      execute(
        'UPDATE devices SET name = %s, model_file = %s, device_code = %s, family_code = %s WHERE id = %s',
        (device_name, model_file, device_code, device_code, existing_id),
      )
      delete_device_variables(existing_id)
      device_id = existing_id
    else:
      device_id = get_or_create_device(plant_id, device_name, unit_id, device_code, model_file)
    insert_server_device_variables(device_id, device['variables'])
    apply_dashboard_defaults_for_device(device_id, model_file)
    upsert_device_asset(device_id, model_file, device_code)
    created.append({
      'device_id': device_id,
      'unit_id': unit_id,
      'name': device_name,
      'model_file': model_file,
      'variables': len(device['variables']),
    })
  return created


@app.post('/api/scans/server-import')
def import_server_map(body: ServerMapScanRequest):
  server_map_file = normalize_model_reference(body.server_map_file)
  devices = parse_server_map_devices(server_map_file or body.server_map_file)
  if not devices:
    raise HTTPException(status_code=404, detail='Nenhum device encontrado no XML do servidor')
  ensure_runtime_plant_columns()
  hostname = f'{body.host}:{body.port}'
  plant_id = get_or_create_plant(
    body.plant_name,
    hostname,
    body.plant_id,
    server_map_file=server_map_file,
    reuse_by_hostname=False,
  )
  session_id = insert_scan_session('tcp', {
    **body.model_dump(),
    'server_map_file': server_map_file or body.server_map_file,
  })
  created = upsert_server_map_devices_for_plant(plant_id, devices)
  if server_map_file:
    server_modbus_map_cache.pop(server_map_file.lower(), None)
  settings.modbus_server_map_file = server_map_file
  finalize_scan_session(session_id, len(created), status='finished')
  insert_scan_log(session_id, 'info', 'Importacao via server map', {
    'plant_id': plant_id,
    'server_map_file': server_map_file,
    'devices': len(created),
  })
  insert_audit_log('server_map_importado', 'scan_sessions', {
    'session_id': session_id,
    'plant_id': plant_id,
    'server_map_file': server_map_file,
    'devices': len(created),
  })
  return {'status': 'ok', 'session_id': session_id, 'plant_id': plant_id, 'devices': created}


@app.post('/api/scans/server-import-upload')
async def import_server_map_upload(
  xml_file: UploadFile = File(...),
  host: str = Form(...),
  port: int = Form(502),
  plant_name: str = Form(...),
  plant_id: int | None = Form(None)
):
  if not xml_file.filename or not xml_file.filename.lower().endswith('.xml'):
    raise HTTPException(status_code=400, detail='Arquivo deve ser um XML')

  try:
    content = await xml_file.read()
    root = ET.fromstring(content)
  except ET.ParseError:
    raise HTTPException(status_code=400, detail='Arquivo XML inválido')
  except Exception as e:
    raise HTTPException(status_code=400, detail=f'Erro ao ler arquivo: {str(e)}')

  if (root.tag or '').lower() != 'mbs_configuration':
    raise HTTPException(status_code=400, detail='XML informado não é um server map válido')

  persisted_filename = persist_uploaded_server_map_file(xml_file.filename, content)
  devices = parse_server_map_devices(persisted_filename)
  if not devices:
    raise HTTPException(status_code=404, detail='Nenhum device encontrado no XML do servidor')

  ensure_runtime_plant_columns()
  hostname = f'{host}:{port}'
  plant_id_result = get_or_create_plant(
    plant_name,
    hostname,
    plant_id,
    server_map_file=persisted_filename,
    reuse_by_hostname=False,
  )
  session_id = insert_scan_session('tcp', {
    'host': host,
    'port': port,
    'server_map_file': persisted_filename,
    'plant_name': plant_name,
    'plant_id': plant_id,
  })
  created = upsert_server_map_devices_for_plant(plant_id_result, devices)
  server_modbus_map_cache.pop(persisted_filename.lower(), None)
  settings.modbus_server_map_file = persisted_filename

  finalize_scan_session(session_id, len(created), status='finished')
  insert_scan_log(session_id, 'info', 'Importacao via server map upload', {
    'plant_id': plant_id_result,
    'server_map_file': persisted_filename,
    'devices': len(created),
  })
  insert_audit_log('server_map_importado', 'scan_sessions', {
    'session_id': session_id,
    'plant_id': plant_id_result,
    'server_map_file': persisted_filename,
    'devices': len(created),
  })
  return {'status': 'ok', 'session_id': session_id, 'plant_id': plant_id_result, 'devices': created}


@app.post('/api/scans/intelligent')
def start_intelligent_scan(body: IntelligentScanRequest):
  if ModbusTcpClient is None or ModbusSerialClient is None:
    raise HTTPException(status_code=501, detail='Dependencia pymodbus nao instalada')

  models = list_model_files()
  if not models:
    raise HTTPException(status_code=404, detail='Nenhum modelo XML encontrado')

  session_id = insert_scan_session(body.protocol, body.model_dump())
  insert_scan_log(session_id, 'info', 'Scan inteligente iniciado', {
    'protocol': body.protocol,
    'host': body.host,
    'port': body.port,
    'unit_id_start': body.unit_id_start,
    'unit_id_end': body.unit_id_end,
  })
  insert_audit_log('scan_inteligente_iniciado', 'scan_sessions', {
    'session_id': session_id,
    'protocol': body.protocol,
    'host': body.host,
  })

  total_units = max(0, body.unit_id_end - body.unit_id_start + 1)
  scan_progress_cache[session_id] = {
    'session_id': session_id,
    'status': 'running',
    'processed_units': 0,
    'total_units': total_units,
    'current_unit': None,
    'unit_status': {},
    'started_at': datetime.utcnow().isoformat(),
    'finished_at': None,
    '_ip': body.host if body.protocol == 'tcp' else body.com_port,
    '_port': body.port if body.protocol == 'tcp' else body.baud_rate,
  }
  scan_summary_cache.pop(session_id, None)
  cancel_event = threading.Event()
  scan_cancel_events[session_id] = cancel_event
  thread = threading.Thread(
    target=run_intelligent_scan_background,
    args=(session_id, body.model_dump(), models, cancel_event),
    daemon=True,
  )
  thread.start()
  return {'session_id': session_id, 'status': 'running'}


class IntelligentScanAcceptRequest(BaseModel):
  session_id: int
  unit_id: int
  model_file: str
  device_name: str
  plant_name: str
  hostname: str
  plant_id: int | None = None


class IntelligentScanAcceptBatchRequest(BaseModel):
  session_id: int
  plant_name: str
  hostname: str
  plant_id: int | None = None
  devices: list[dict[str, Any]]


@app.post('/api/scans/intelligent/accept')
def accept_intelligent_scan(body: IntelligentScanAcceptRequest):
  model_path = resolve_model_path(body.model_file)
  device_code, entries = parse_model_info(model_path)
  descriptions = parse_var_descriptions(model_path)
  plant_id = get_or_create_plant(body.plant_name, body.hostname, body.plant_id)
  device_id = get_device_id(plant_id, body.unit_id)
  if device_id:
    execute(
      'UPDATE devices SET name = %s, model_file = %s, device_code = %s WHERE id = %s',
      (body.device_name, body.model_file, device_code, device_id),
    )
    delete_device_variables(device_id)
  else:
    device_id = get_or_create_device(plant_id, body.device_name, body.unit_id, device_code, body.model_file)
  insert_device_variables(device_id, entries, descriptions)
  apply_dashboard_defaults_for_device(device_id, body.model_file)
  upsert_device_asset(device_id, body.model_file, device_code)
  insert_scan_log(body.session_id, 'info', 'Modelo aceito pelo operador', {
    'unit_id': body.unit_id,
    'model_file': body.model_file,
    'device_name': body.device_name,
    'device_id': device_id,
    'plant_id': plant_id,
  })
  insert_audit_log('scan_inteligente_aceito', 'scan_sessions', {
    'session_id': body.session_id,
    'unit_id': body.unit_id,
    'model_file': body.model_file,
    'device_name': body.device_name,
    'device_id': device_id,
    'plant_id': plant_id,
  })
  return {'status': 'ok', 'device_id': device_id, 'plant_id': plant_id}


@app.post('/api/scans/intelligent/accept-batch')
def accept_intelligent_scan_batch(body: IntelligentScanAcceptBatchRequest):
  plant_id = get_or_create_plant(body.plant_name, body.hostname, body.plant_id)
  created: list[dict[str, Any]] = []
  skipped: list[dict[str, Any]] = []
  for device in body.devices:
    unit_id = int(device.get('unit_id'))
    model_file = str(device.get('model_file') or '')
    device_name = str(device.get('device_name') or f'Device {unit_id}')
    if not model_file:
      continue
    existing_id = get_device_id(plant_id, unit_id)
    model_path = resolve_model_path(model_file)
    device_code, entries = parse_model_info(model_path)
    descriptions = parse_var_descriptions(model_path)
    if existing_id:
      execute(
        'UPDATE devices SET name = %s, model_file = %s, device_code = %s WHERE id = %s',
        (device_name, model_file, device_code, existing_id),
      )
      delete_device_variables(existing_id)
      device_id = existing_id
    else:
      device_id = get_or_create_device(plant_id, device_name, unit_id, device_code, model_file)
    insert_device_variables(device_id, entries, descriptions)
    apply_dashboard_defaults_for_device(device_id, model_file)
    upsert_device_asset(device_id, model_file, device_code)
    created.append({'device_id': device_id, 'unit_id': unit_id, 'model_file': model_file})
  insert_scan_log(body.session_id, 'info', 'Modelos aceitos em lote', {
    'count': len(created),
    'plant_id': plant_id,
  })
  insert_audit_log('scan_inteligente_aceito_lote', 'scan_sessions', {
    'session_id': body.session_id,
    'count': len(created),
    'plant_id': plant_id,
  })
  if not created:
    return {'status': 'no_new_devices', 'created': [], 'skipped': skipped, 'plant_id': plant_id}
  return {'status': 'ok', 'created': created, 'skipped': skipped, 'plant_id': plant_id}


@app.get('/api/scans/{session_id}/progress')
def get_scan_progress(session_id: int):
  progress = scan_progress_cache.get(session_id)
  if progress:
    total_units = max(1, int(progress.get('total_units') or 1))
    processed_units = int(progress.get('processed_units') or 0)
    percent = min(100.0, round((processed_units / total_units) * 100, 1))
    return {
      'session_id': session_id,
      'status': progress.get('status'),
      'processed_units': processed_units,
      'total_units': total_units,
      'current_unit': progress.get('current_unit'),
      'unit_status': progress.get('unit_status', {}),
      'percent': percent,
      'ip': progress.get('_ip'),
      'port': progress.get('_port'),
    }
  rows = query('SELECT status, total_results FROM scan_sessions WHERE id = %s', (session_id,))
  if not rows:
    raise HTTPException(status_code=404, detail='Scan nao encontrado')
  return {
    'session_id': session_id,
    'status': rows[0]['status'],
    'processed_units': rows[0].get('total_results') or 0,
    'total_units': rows[0].get('total_results') or 0,
    'current_unit': None,
    'unit_status': {},
    'percent': 100.0 if rows[0]['status'] == 'finished' else 0.0,
  }


@app.get('/api/scans/{session_id}/summary')
def get_scan_summary(session_id: int):
  summary = scan_summary_cache.get(session_id)
  if summary:
    return summary
  progress = scan_progress_cache.get(session_id)
  if progress:
    return {'session_id': session_id, 'status': progress.get('status')}
  rows = query('SELECT status FROM scan_sessions WHERE id = %s', (session_id,))
  if not rows:
    raise HTTPException(status_code=404, detail='Scan nao encontrado')
  return {'session_id': session_id, 'status': rows[0]['status']}


@app.post('/api/scans/{session_id}/cancel')
def cancel_scan(session_id: int):
  event = scan_cancel_events.get(session_id)
  if event:
    event.set()
    progress = scan_progress_cache.get(session_id)
    if progress:
      progress['status'] = 'cancelled'
    insert_scan_log(session_id, 'warning', 'Cancelamento solicitado', {'session_id': session_id})
    return {'status': 'ok'}
  raise HTTPException(status_code=404, detail='Scan nao encontrado')




@app.get('/api/devices/{device_id}/variables')
def list_device_variables(device_id: int):
  rows = query(
    (
      'SELECT id, code, label, function_code, offset, length, address_in, measure_unit, decimals '
      'FROM device_variables WHERE device_id = %s ORDER BY id ASC'
    ),
    (device_id,),
  )
  if rows:
    return {'data': rows}
  if device_id in device_variables_cache:
    return {'data': device_variables_cache[device_id]}
  return {'data': []}


@app.get('/api/devices/{device_id}/asset')
def get_device_asset(device_id: int):
  rows = query('SELECT image_key, image_path, model_file FROM device_assets WHERE device_id = %s LIMIT 1', (device_id,))
  if rows:
    return rows[0]
  device_rows = query('SELECT model_file, device_code FROM devices WHERE id = %s', (device_id,))
  device = device_rows[0] if device_rows else None
  image_key, image_path = resolve_device_image(device.get('model_file') if device else None, device.get('device_code') if device else None)
  return {'image_key': image_key, 'image_path': image_path, 'model_file': device.get('model_file') if device else None}


class DashboardVariablesUpdate(BaseModel):
  variable_ids: list[int]

  @field_validator('variable_ids')
  @classmethod
  def validate_limit(cls, value):  # noqa: ANN001
    if not value:
      return []
    if len(value) > 5:
      raise ValueError('Selecione no maximo 5 variaveis')
    return value


class MiniGraphVariablesUpdate(BaseModel):
  variable_ids: list[int]

  @field_validator('variable_ids')
  @classmethod
  def validate_limit(cls, value):  # noqa: ANN001
    if not value:
      return []
    if len(value) > 3:
      raise ValueError('Selecione no maximo 3 variaveis')
    return value


def validate_device_variable_ids(device_id: int, variable_ids: list[int]) -> None:
  if not variable_ids:
    return
  rows = query(
    'SELECT id FROM device_variables WHERE device_id = %s AND id IN (%s)' % (
      '%s',
      ','.join(['%s'] * len(variable_ids)),
    ),
    (device_id, *variable_ids),
  )
  valid_ids = {int(row['id']) for row in rows}
  if len(valid_ids) != len(set(variable_ids)):
    raise HTTPException(status_code=400, detail='Variaveis invalidas para este device')


@app.get('/api/devices/{device_id}/dashboard-variables')
def get_device_dashboard_variables(device_id: int):
  rows = query(
    (
      'SELECT dv.variable_id, v.code, v.label '
      'FROM device_dashboard_variables dv '
      'JOIN device_variables v ON v.id = dv.variable_id '
      'WHERE dv.device_id = %s '
      'ORDER BY dv.display_order ASC, dv.id ASC'
    ),
    (device_id,),
  )
  return {'data': rows or []}


@app.put('/api/devices/{device_id}/dashboard-variables')
def update_device_dashboard_variables(device_id: int, body: DashboardVariablesUpdate):
  variable_ids = body.variable_ids or []
  validate_device_variable_ids(device_id, variable_ids)
  execute('DELETE FROM device_dashboard_variables WHERE device_id = %s', (device_id,))
  if variable_ids:
    rows_to_insert = [(device_id, var_id, index) for index, var_id in enumerate(variable_ids)]
    execute(
      'INSERT INTO device_dashboard_variables (device_id, variable_id, display_order) VALUES (%s, %s, %s)',
      rows_to_insert,
      many=True,
    )
  insert_audit_log('dashboard_variaveis_atualizadas', 'device_dashboard_variables', {
    'device_id': device_id,
    'variable_ids': variable_ids,
  })
  return {'status': 'ok', 'count': len(variable_ids)}


@app.get('/api/devices/{device_id}/mini-graph-variables')
def get_device_mini_graph_variables(device_id: int):
  rows = query(
    (
      'SELECT mv.variable_id, v.code, v.label '
      'FROM device_mini_graph_variables mv '
      'JOIN device_variables v ON v.id = mv.variable_id '
      'WHERE mv.device_id = %s '
      'ORDER BY mv.display_order ASC, mv.id ASC'
    ),
    (device_id,),
  )
  if rows:
    return {'data': rows}
  fallback_rows = query(
    (
      'SELECT dv.variable_id, v.code, v.label '
      'FROM device_dashboard_variables dv '
      'JOIN device_variables v ON v.id = dv.variable_id '
      'WHERE dv.device_id = %s '
      'ORDER BY dv.display_order ASC, dv.id ASC '
      'LIMIT 3'
    ),
    (device_id,),
  )
  return {'data': fallback_rows or []}


@app.put('/api/devices/{device_id}/mini-graph-variables')
def update_device_mini_graph_variables(device_id: int, body: MiniGraphVariablesUpdate):
  variable_ids = body.variable_ids or []
  validate_device_variable_ids(device_id, variable_ids)
  execute('DELETE FROM device_mini_graph_variables WHERE device_id = %s', (device_id,))
  if variable_ids:
    rows_to_insert = [(device_id, var_id, index) for index, var_id in enumerate(variable_ids)]
    execute(
      'INSERT INTO device_mini_graph_variables (device_id, variable_id, display_order) VALUES (%s, %s, %s)',
      rows_to_insert,
      many=True,
    )
  insert_audit_log('mini_grafico_variaveis_atualizadas', 'device_mini_graph_variables', {
    'device_id': device_id,
    'variable_ids': variable_ids,
  })
  return {'status': 'ok', 'count': len(variable_ids)}


class DeviceVariableUpdate(BaseModel):
  label: str


class DeviceVariableWrite(BaseModel):
  code: str
  value: float | int | str


@app.put('/api/devices/{device_id}/variables/{variable_id}')
def update_device_variable(device_id: int, variable_id: int, body: DeviceVariableUpdate):
  updated = execute(
    'UPDATE device_variables SET label = %s WHERE id = %s AND device_id = %s',
    (body.label, variable_id, device_id),
  )
  if updated is None:
    raise HTTPException(status_code=500, detail='Nao foi possivel atualizar a variavel')
  insert_audit_log('variavel_atualizada', 'device_variables', {
    'device_id': device_id,
    'variable_id': variable_id,
    'label': body.label,
  })
  return {'status': 'ok'}


def decode_registers(
  registers: list[int] | None,
  length: int,
  decimals: int | None,
  swap_words: bool = False,
  signed: bool | None = None,
) -> float | int | None:
  if registers is None:
    return None
  if length <= 1:
    value = registers[0] if registers else None
    if value is not None and signed and value >= 0x8000:
      value -= 0x10000
  else:
    if len(registers) < 2:
      return None
    high, low = registers[0], registers[1]
    if swap_words:
      high, low = low, high
    packed = struct.pack('>HH', high, low)
    value = struct.unpack('>f', packed)[0]
  if value is None:
    return None
  if decimals is not None:
    if length <= 1:
      value = float(value) / (10 ** decimals)
    return round(float(value), decimals)
  return value


def encode_registers(
  value: float | int,
  length: int,
  decimals: int | None,
  swap_words: bool = False,
  signed: bool | None = None,
) -> list[int]:
  numeric = float(value)
  if decimals is not None and length <= 1:
    numeric = numeric * (10 ** decimals)
  elif decimals is not None:
    numeric = round(numeric, decimals)
  if length <= 1:
    as_int = int(round(numeric))
    if as_int < 0:
      as_int = as_int & 0xFFFF
    return [as_int]
  packed = struct.pack('>f', float(numeric))
  high, low = struct.unpack('>HH', packed)
  if swap_words:
    return [low, high]
  return [high, low]


def normalize_write_code(code: str) -> str:
  clean = (code or '').strip()
  if not clean:
    raise HTTPException(status_code=400, detail='Codigo obrigatorio')
  alias = WRITE_CODE_ALIASES.get(clean.lower())
  return alias or clean


def parse_numeric_value(raw: float | int | str) -> float:
  if isinstance(raw, (int, float)):
    return float(raw)
  if isinstance(raw, str):
    cleaned = raw.strip().replace(',', '.')
    if not cleaned:
      raise HTTPException(status_code=400, detail='Valor nao informado')
    try:
      return float(cleaned)
    except ValueError as exc:  # noqa: PERF203
      raise HTTPException(status_code=400, detail='Valor invalido') from exc
  raise HTTPException(status_code=400, detail='Valor invalido')


def parse_coil_value(raw: float | int | str) -> bool:
  if isinstance(raw, bool):
    return raw
  if isinstance(raw, (int, float)):
    return bool(int(raw))
  if isinstance(raw, str):
    cleaned = raw.strip().lower()
    if cleaned in {'1', 'true', 'on', 'ligado', 'sim', 'yes'}:
      return True
    if cleaned in {'0', 'false', 'off', 'desligado', 'nao', 'no'}:
      return False
  raise HTTPException(status_code=400, detail='Valor invalido')


def parse_tcp_hostname(hostname: str) -> tuple[str, int]:
  value = (hostname or '').strip()
  if not value:
    raise HTTPException(status_code=400, detail='Hostname invalido')

  if '://' in value:
    parsed = urlparse(value)
    host = (parsed.hostname or '').strip()
    if not host:
      raise HTTPException(status_code=400, detail='Hostname invalido')
    port = int(parsed.port) if parsed.port else 502
    return host, port

  if ':' in value:
    host, port_raw = value.split(':', 1)
    host = host.strip()
    if not host:
      raise HTTPException(status_code=400, detail='Hostname invalido')
    try:
      port = int(port_raw.strip())
    except ValueError as exc:
      raise HTTPException(status_code=400, detail='Porta TCP invalida') from exc
    return host, port

  return value, 502


def parse_iso_datetime(value: str | None) -> datetime | None:
  if not value:
    return None
  try:
    if value.endswith('Z'):
      value = value[:-1]
    return datetime.fromisoformat(value)
  except ValueError:
    return None


@app.middleware('http')
async def track_user_activity(request, call_next):  # type: ignore[ANN001]
  global last_user_activity
  last_user_activity = datetime.utcnow().timestamp()
  response = await call_next(request)
  return response


def update_latest_telemetry_cache(
  device_id: int,
  rows: list[dict[str, Any]],
  source: str | None = None,
) -> None:
  if not rows:
    return
  now = datetime.utcnow().isoformat()
  merged: dict[str, dict[str, Any]] = {}
  for row in latest_telemetry_cache.get(device_id, []):
    code = row.get('code')
    if not code:
      continue
    key = normalize_modbus_code(code) or code
    merged[key] = row
  for row in rows:
    value = row.get('value')
    if value is None:
      continue
    code = row.get('code')
    if not code:
      continue
    key = normalize_modbus_code(code) or code
    next_row = dict(row)
    row_source = next_row.get('source') or source
    if source and not next_row.get('source'):
      next_row['source'] = source
    if not next_row.get('captured_at') and row_source != 'fallback':
      next_row['captured_at'] = now
    merged[key] = next_row
  if merged:
    latest_telemetry_cache[device_id] = list(merged.values())


def get_latest_telemetry_cache(device_id: int) -> list[dict[str, Any]]:
  cached = latest_telemetry_cache.get(device_id)
  return cached or []


def get_rows_freshness_seconds(rows: list[dict[str, Any]]) -> float | None:
  newest: datetime | None = None
  for row in rows:
    captured = row.get('captured_at')
    if not captured:
      continue
    try:
      parsed = datetime.fromisoformat(str(captured))
    except ValueError:
      continue
    if newest is None or parsed > newest:
      newest = parsed
  if newest is None:
    return None
  return max(0.0, (datetime.utcnow() - newest).total_seconds())


def tag_telemetry_rows(rows: list[dict[str, Any]], source: str) -> list[dict[str, Any]]:
  tagged: list[dict[str, Any]] = []
  for row in rows:
    if row.get('source') == source:
      tagged.append(row)
    else:
      tagged.append({**row, 'source': source})
  return tagged


def build_fallback_telemetry(device_id: int) -> list[dict[str, Any]]:
  fallback = fallback_telemetry.get(device_id)
  if not fallback:
    return []
  vars_rows = query(
    (
      'SELECT id, code, label, measure_unit, decimals '
      'FROM device_variables WHERE device_id = %s ORDER BY id ASC'
    ),
    (device_id,),
  )
  if not vars_rows and device_id in device_variables_cache:
    vars_rows = device_variables_cache[device_id]
  rows: list[dict[str, Any]] = []
  if not vars_rows:
    for code, value in fallback.items():
      rows.append({
        'variable_id': None,
        'code': code,
        'label': code,
        'unit': None,
        'decimals': None,
        'value': value,
        'captured_at': None,
        'source': 'fallback',
      })
    return rows
  for var in vars_rows:
    code = var.get('code')
    if code not in fallback:
      continue
    rows.append({
      'variable_id': var.get('id'),
      'code': code,
      'label': var.get('label'),
      'unit': var.get('measure_unit'),
      'decimals': var.get('decimals'),
      'value': fallback[code],
      'captured_at': None,
      'source': 'fallback',
    })
  return rows


def fetch_latest_telemetry(device_id: int) -> list[dict[str, Any]]:
  cached_rows = get_latest_telemetry_cache(device_id)
  if cached_rows:
    cache_age_seconds = get_rows_freshness_seconds(cached_rows)
    if cache_age_seconds is None or cache_age_seconds <= 2.0:
      return cached_rows

  rows = query(
    (
      'SELECT v.id AS variable_id, v.code, v.label, v.measure_unit AS unit, v.decimals, '
      't.value, t.captured_at '
      'FROM device_variables v '
      'LEFT JOIN ('
      '  SELECT t1.metric, t1.value, t1.captured_at '
      '  FROM telemetry t1 '
      '  WHERE t1.device_id = %s '
      '    AND t1.captured_at = ('
      '      SELECT MAX(t2.captured_at) '
      '      FROM telemetry t2 '
      '      WHERE t2.device_id = %s AND t2.metric = t1.metric'
      '    )'
      ') t ON t.metric = v.code '
      'WHERE v.device_id = %s '
      'ORDER BY v.id ASC'
    ),
    (device_id, device_id, device_id),
  )
  if rows:
    has_value = any(row.get('value') is not None for row in rows)
    if has_value:
      tagged = tag_telemetry_rows(rows, 'db')
      update_latest_telemetry_cache(device_id, tagged, source='db')
      return tagged
  telemetry_rows = query(
    (
      'SELECT dv.id AS variable_id, t.metric AS code, dv.label, dv.measure_unit AS unit, dv.decimals, '
      't.value, t.captured_at '
      'FROM telemetry t '
      'JOIN ('
      '  SELECT metric, MAX(captured_at) AS captured_at '
      '  FROM telemetry '
      '  WHERE device_id = %s '
      '  GROUP BY metric'
      ') latest ON latest.metric = t.metric AND latest.captured_at = t.captured_at '
      'LEFT JOIN device_variables dv ON dv.device_id = %s AND dv.code = t.metric '
      'WHERE t.device_id = %s '
      'ORDER BY COALESCE(dv.id, 999999), t.metric'
    ),
    (device_id, device_id, device_id),
  )
  if telemetry_rows:
    tagged = tag_telemetry_rows(telemetry_rows, 'db')
    update_latest_telemetry_cache(device_id, tagged, source='db')
    return tagged
  readings_rows = query(
    (
      'SELECT dv.id AS variable_id, dr.code, dv.label, dv.measure_unit AS unit, dv.decimals, '
      'dr.value, dr.captured_at '
      'FROM device_readings dr '
      'JOIN ('
      '  SELECT code, MAX(captured_at) AS captured_at '
      '  FROM device_readings '
      '  WHERE device_id = %s '
      '  GROUP BY code'
      ') latest ON latest.code = dr.code AND latest.captured_at = dr.captured_at '
      'LEFT JOIN device_variables dv ON dv.device_id = %s AND dv.code = dr.code '
      'WHERE dr.device_id = %s '
      'ORDER BY COALESCE(dv.id, 999999), dr.code'
    ),
    (device_id, device_id, device_id),
  )
  if readings_rows:
    tagged = tag_telemetry_rows(readings_rows, 'readings')
    update_latest_telemetry_cache(device_id, tagged, source='readings')
    return tagged
  cached_rows = get_latest_telemetry_cache(device_id)
  if cached_rows:
    return cached_rows
  fallback_rows = build_fallback_telemetry(device_id)
  if fallback_rows:
    return fallback_rows
  return rows or []


def collect_device_readings(
  device_id: int,
  scope: Literal['dashboard', 'all'] | None = None,
  priority: Literal['fast', 'medium', 'slow'] | None = None,
  persist_readings: bool = True,
  include_latest: bool = True,
) -> dict[str, Any]:
  if ModbusTcpClient is None:
    raise HTTPException(status_code=501, detail='Dependencia pymodbus nao instalada')
  device_rows = query(
    'SELECT id, plant_id, modbus_id, model_file FROM devices WHERE id = %s',
    (device_id,),
  )
  db_device_exists = bool(device_rows)
  device = device_rows[0] if device_rows else devices_cache.get(device_id)
  if not device:
    raise HTTPException(status_code=404, detail='Device nao encontrado')
  swap_words = should_swap_words(device.get('model_file'))
  model_metadata: dict[str, dict[str, Any]] = {}
  model_function_map: dict[str, int] = {}
  model_file = device.get('model_file')
  if model_file:
    try:
      model_metadata = load_model_metadata(model_file)
      model_function_map = load_model_function_map(model_file)
    except HTTPException:
      model_metadata = {}
      model_function_map = {}
  plant_rows = query('SELECT hostname FROM plants WHERE id = %s', (device['plant_id'],))
  if plant_rows:
    hostname = plant_rows[0]['hostname'] or ''
  else:
    hostname = plants_cache.get(device['plant_id'], {}).get('hostname', '')
  if not hostname:
    raise HTTPException(status_code=404, detail='Planta nao encontrada')
  if 'COM' in hostname or 'tty' in hostname:
    raise HTTPException(status_code=400, detail='Leitura RTU nao suportada nesta rota')
  host, port = parse_tcp_hostname(hostname)

  if scope == 'dashboard':
    variables = query(
      (
        'SELECT v.id, v.code, v.label, v.function_code, v.offset, v.length, v.address_in, '
        'v.measure_unit, v.decimals '
        'FROM ('
        '  SELECT variable_id, MIN(source_priority) AS source_priority, MIN(display_order) AS display_order '
        '  FROM ('
        '    SELECT variable_id, display_order, 0 AS source_priority '
        '    FROM device_dashboard_variables WHERE device_id = %s '
        '    UNION ALL '
        '    SELECT variable_id, display_order, 1 AS source_priority '
        '    FROM device_mini_graph_variables WHERE device_id = %s '
        '  ) selected_union '
        '  GROUP BY variable_id'
        ') selected '
        'JOIN device_variables v ON v.id = selected.variable_id '
        'ORDER BY selected.source_priority ASC, selected.display_order ASC, v.id ASC'
      ),
      (device_id, device_id),
    )
  else:
    variables = query(
      (
        'SELECT id, code, label, function_code, offset, length, address_in, measure_unit, decimals '
        'FROM device_variables WHERE device_id = %s ORDER BY id ASC'
      ),
      (device_id,),
    )
  if scope == 'dashboard' and not variables:
    variables = query(
      (
        'SELECT id, code, label, function_code, offset, length, address_in, measure_unit, decimals '
        'FROM device_variables WHERE device_id = %s ORDER BY id ASC'
      ),
      (device_id,),
    )
  if not variables and device_id in device_variables_cache:
    variables = device_variables_cache[device_id]
  if not variables:
    return {'device_id': device_id, 'readings': [], 'latest': []}

  server_map = load_server_modbus_map_for_plant(int(device.get('plant_id')) if device.get('plant_id') is not None else None)
  if not server_map:
    server_map = load_server_modbus_map()
  device_map = server_map.get(int(device['modbus_id'])) if server_map else None
  if device_map:
    variables = [
      variable for variable in variables
      if normalize_modbus_code(variable['code']) in device_map
    ]
  codes_hint = {normalize_modbus_code(item.get('code')) for item in variables if item.get('code')}
  is_mpxpro = is_mpxpro_device(model_file, {code for code in codes_hint if code})
  if is_mpxpro:
    swap_words = True
  resolved_variables: list[dict[str, Any]] = []
  for variable in variables:
    function_code = int(variable['function_code'])
    offset = int(variable['offset'])
    address_in = variable.get('address_in')
    normalized = normalize_modbus_code(variable['code'])
    model_function = model_function_map.get(normalized) if normalized else None
    if model_function is not None:
      function_code = int(model_function)
    length = int(variable.get('length') or 1)
    if is_mpxpro and normalized in MPXPRO_FLOAT_CODES and function_code in (3, 4):
      length = 2
    elif is_mpxpro and normalized == 'po2' and length > 1:
      length = 1
    meta = model_metadata.get(normalized) if normalized else None
    decimals = variable.get('decimals')
    if decimals is None and meta:
      decimals = meta.get('decimals')
    signed = meta.get('signed') if meta else None
    if device_map and normalized:
      override = device_map.get(normalized)
      if override:
        offset = int(override.get('offset', offset))
        address_in = override.get('address_in', address_in)
        override_function = override.get('function_code')
        if override_function is not None and model_function is None:
          function_code = int(override_function)
    resolved_variables.append({
      **variable,
      'function_code': function_code,
      'offset': offset,
      'address_in': address_in,
      'length': length,
      'decimals': decimals,
      'signed': signed,
    })

  normalized_priority = normalize_read_priority(priority)
  if normalized_priority:
    resolved_variables = filter_variables_for_priority(resolved_variables, normalized_priority)
  if not resolved_variables:
    latest = fetch_latest_telemetry(device_id) if include_latest else get_latest_telemetry_cache(device_id)
    return {'device_id': device_id, 'readings': [], 'latest': latest}

  client = ModbusTcpClient(host=host, port=port, timeout=2.0)
  if not client.connect():
    raise HTTPException(status_code=502, detail='Falha ao conectar dispositivo')

  readings: list[dict[str, Any]] = []
  telemetry_rows: list[tuple[Any, ...]] = []
  raw_rows: list[tuple[Any, ...]] = []
  batches = build_read_batches(resolved_variables, max_gap=DEFAULT_BATCH_GAP_REGISTERS)

  for batch in batches:
    status, registers, error, response_ms = read_modbus(
      client,
      int(device['modbus_id']),
      int(batch['function_code']),
      int(batch['start']),
      int(batch['length']),
    )
    for variable in batch['variables']:
      offset = int(variable['offset'])
      length = int(variable['length'])
      index = offset - int(batch['start'])
      register_slice: list[int] | None = None
      value: float | int | bool | None = None
      var_status = status
      var_error = error

      if status == 'Good':
        if registers is None or index < 0 or index + length > len(registers):
          var_status = 'Error'
          var_error = 'Leitura fora do range'
        else:
          register_slice = registers[index:index + length]
          value = decode_registers(
            register_slice,
            length,
            variable.get('decimals'),
            swap_words=swap_words,
            signed=variable.get('signed'),
          )
          var_error = None

      readings.append({
        'variable_id': variable['id'],
        'code': variable['code'],
        'label': variable['label'],
        'function_code': int(variable['function_code']),
        'offset': offset,
        'length': length,
        'address_in': variable.get('address_in'),
        'unit': variable.get('measure_unit'),
        'decimals': variable.get('decimals'),
        'value': value,
        'status': var_status,
        'error': var_error,
        'response_ms': response_ms,
      })
      if value is not None and var_status == 'Good':
        telemetry_rows.append((device_id, variable['code'], float(value), datetime.utcnow()))
      if var_status == 'Good':
        raw_rows.append((
          device_id,
          variable['id'],
          variable['code'],
          float(value) if value is not None else None,
          var_status,
          var_error,
          response_ms,
          json.dumps(register_slice) if register_slice is not None else None,
          datetime.utcnow(),
        ))
  client.close()

  latest_snapshot: list[dict[str, Any]] = []
  captured_at = datetime.utcnow().isoformat()
  for reading in readings:
    if reading.get('status') != 'Good':
      continue
    value = reading.get('value')
    if value is None:
      continue
    latest_snapshot.append({
      'variable_id': reading.get('variable_id'),
      'code': reading.get('code'),
      'label': reading.get('label'),
      'unit': reading.get('unit'),
      'decimals': reading.get('decimals'),
      'value': value,
      'captured_at': captured_at,
      'source': 'live',
  })
  if latest_snapshot:
    update_latest_telemetry_cache(device_id, latest_snapshot, source='live')

  if persist_readings and telemetry_rows and db_device_exists:
    execute(
      'INSERT INTO telemetry (device_id, metric, value, captured_at) VALUES (%s, %s, %s, %s)',
      telemetry_rows,
      many=True,
    )
  elif persist_readings and telemetry_rows and not db_device_exists:
    logger.warning('Telemetria ignorada: device %s nao existe no banco', device_id)
  if persist_readings and raw_rows and db_device_exists:
    try:
      execute(
        (
          'INSERT INTO device_readings '
          '(device_id, variable_id, code, value, status, error, response_ms, raw_registers, captured_at) '
          'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
        ),
        raw_rows,
        many=True,
      )
    except Exception as exc:  # noqa: BLE001
      logger.warning('Nao foi possivel salvar device_readings (talvez tabela ausente): %s', exc)
  if db_device_exists:
    execute('UPDATE devices SET last_seen_at = %s WHERE id = %s', (datetime.utcnow(), device_id))
  if include_latest:
    latest = fetch_latest_telemetry(device_id)
  else:
    latest = latest_snapshot if latest_snapshot else get_latest_telemetry_cache(device_id)
  if persist_readings or include_latest:
    insert_audit_log('telemetria_lida', 'devices', {
      'device_id': device_id,
      'count': len(readings),
      'priority': normalized_priority,
      'persist': persist_readings,
    })
  return {'device_id': device_id, 'readings': readings, 'latest': latest}


def cleanup_telemetry_tables() -> None:
  telemetry_cutoff = datetime.utcnow() - timedelta(days=int(settings.telemetry_retention_days))
  readings_cutoff = datetime.utcnow() - timedelta(days=int(settings.readings_retention_days))
  execute('DELETE FROM telemetry WHERE captured_at < %s', (telemetry_cutoff,))
  execute('DELETE FROM device_readings WHERE captured_at < %s', (readings_cutoff,))


def run_intelligent_scan_background(
  session_id: int,
  config: dict[str, Any],
  models: list[str],
  cancel_event: threading.Event,
) -> None:
  results: list[dict[str, Any]] = []
  total_attempts = 0
  best_score = -1.0
  best_candidates: list[dict[str, Any]] = []
  best_results: list[dict[str, Any]] = []
  unit_matches: list[dict[str, Any]] = []
  unit_status: dict[int, str] = {}
  progress = scan_progress_cache.get(session_id)
  try:
    if config.get('protocol') == 'tcp':
      client = ModbusTcpClient(host=config.get('host'), port=config.get('port'), timeout=config.get('timeout'))
      if not client.connect():
        insert_scan_log(session_id, 'error', 'Falha ao conectar TCP', {'ip': config.get('host'), 'port': config.get('port')})
        finalize_scan_session(session_id, total_attempts, status='failed')
        scan_progress_cache[session_id]['status'] = 'failed'
        return
      connection_label = f"TCP IP: {config.get('host')}:{config.get('port')}"
    else:
      client = ModbusSerialClient(
        method='rtu',
        port=config.get('com_port'),
        baudrate=config.get('baud_rate'),
        parity=config.get('parity'),
        stopbits=config.get('stop_bits'),
        bytesize=config.get('bytesize'),
        timeout=config.get('timeout'),
      )
      if not client.connect():
        insert_scan_log(session_id, 'error', 'Falha ao conectar RTU', {'port': config.get('com_port')})
        finalize_scan_session(session_id, total_attempts, status='failed')
        scan_progress_cache[session_id]['status'] = 'failed'
        return
      connection_label = f"RTU: {config.get('com_port')}"

    for unit_id in range(int(config.get('unit_id_start', 0)), int(config.get('unit_id_end', 0)) + 1):
      if cancel_event.is_set():
        scan_progress_cache[session_id]['status'] = 'cancelled'
        finalize_scan_session(session_id, total_attempts, status='failed')
        insert_scan_log(session_id, 'warning', 'Scan inteligente cancelado', {'unit_id': unit_id})
        client.close()
        scan_summary_cache[session_id] = {
          'session_id': session_id,
          'status': 'cancelled',
          'total_attempts': total_attempts,
          'best_score': best_score,
          'candidates': best_candidates,
          'results': best_results,
        }
        return
      unit_status[unit_id] = 'lendo'
      scan_progress_cache[session_id]['current_unit'] = unit_id
      scan_progress_cache[session_id]['unit_status'] = unit_status
      has_any_good = False
      unit_best_score = -1.0
      unit_best_candidate: dict[str, Any] | None = None
      for model_file in models:
        model_path = resolve_model_path(model_file)
        device_code, entries = parse_model_info(model_path, config.get('length_map'))
        entries = [entry for entry in entries if entry['function_code'] in config.get('function_codes', [])]
        if not entries:
          continue
        good_count = 0
        model_results: list[dict[str, Any]] = []
        for entry in entries:
          if cancel_event.is_set():
            break
          status, registers, error, response_ms = read_modbus(
            client,
            unit_id,
            entry['function_code'],
            entry['offset'],
            entry['length'],
          )
          total_attempts += 1
          if status == 'Good':
            good_count += 1
            has_any_good = True
          result = {
            'connection': connection_label,
            'ip': config.get('host') if config.get('protocol') == 'tcp' else None,
            'port': config.get('port') if config.get('protocol') == 'tcp' else None,
            'unit_id': unit_id,
            'function_code': entry['function_code'],
            'offset': entry['offset'],
            'length': entry['length'],
            'status': status,
            'response_ms': response_ms,
            'error': error,
            'registers': registers,
            'codes': entry.get('codes', []),
            'address_in': entry.get('address_in'),
            'model_file': model_file,
            'device_code': device_code,
          }
          result_id = insert_scan_result(session_id, result)
          result['id'] = result_id or result.get('id')
          results.append(result)
          model_results.append(result)
        if entries:
          score = good_count / len(entries)
          summary = {
            'model_file': model_file,
            'device_code': device_code,
            'unit_id': unit_id,
            'good': good_count,
            'total': len(entries),
            'score': score,
          }
          insert_scan_log(session_id, 'info', 'Resultado de compatibilidade', summary)
          if score > best_score:
            best_score = score
            best_candidates = [summary]
            best_results = model_results
          elif score == best_score:
            best_candidates.append(summary)
          if score > unit_best_score:
            unit_best_score = score
            unit_best_candidate = summary
      unit_status[unit_id] = 'ok' if has_any_good else 'erro'
      if has_any_good and unit_best_candidate:
        unit_matches.append(unit_best_candidate)
      scan_progress_cache[session_id]['processed_units'] = scan_progress_cache[session_id]['processed_units'] + 1
      scan_progress_cache[session_id]['unit_status'] = unit_status

    client.close()
  except Exception as exc:  # noqa: BLE001
    insert_scan_log(session_id, 'error', 'Falha durante scan inteligente', {'error': str(exc)})
    finalize_scan_session(session_id, total_attempts, status='failed')
    scan_progress_cache[session_id]['status'] = 'failed'
    scan_summary_cache[session_id] = {
      'session_id': session_id,
      'status': 'failed',
      'total_attempts': total_attempts,
      'best_score': best_score,
      'candidates': best_candidates,
      'results': best_results,
    }
    return

  status = 'finished' if best_score >= 0 else 'failed'
  finalize_scan_session(session_id, total_attempts, status=status)
  scan_progress_cache[session_id]['status'] = status
  scan_progress_cache[session_id]['finished_at'] = datetime.utcnow().isoformat()
  if len(best_candidates) > 1:
    insert_scan_log(session_id, 'warning', 'Empate entre modelos', {
      'candidates': best_candidates,
    })
  insert_scan_log(session_id, 'info', 'Scan inteligente finalizado', {
    'total_attempts': total_attempts,
    'best_score': best_score,
  })
  insert_audit_log('scan_inteligente_finalizado', 'scan_sessions', {
    'session_id': session_id,
    'total_attempts': total_attempts,
    'best_score': best_score,
  })
  scan_summary_cache[session_id] = {
    'session_id': session_id,
    'status': status,
    'total_attempts': total_attempts,
    'best_score': best_score,
    'candidates': best_candidates,
    'results': best_results,
    'unit_matches': unit_matches,
  }


@app.get('/api/devices/{device_id}/readings')
def read_device_variables(
  device_id: int,
  scope: Literal['dashboard', 'all'] | None = Query(default=None),
  priority: Literal['fast', 'medium', 'slow'] | None = Query(default=None),
  persist: bool = Query(default=True),
):
  try:
    return collect_device_readings(
      device_id,
      scope=scope,
      priority=priority,
      persist_readings=persist,
      include_latest=True,
    )
  except HTTPException as exc:
    fallback = fetch_latest_telemetry(device_id)
    if fallback:
      return {'device_id': device_id, 'readings': fallback, 'latest': fallback, 'fallback': True}
    raise


@app.post('/api/devices/{device_id}/write')
def write_device_variable(device_id: int, body: DeviceVariableWrite):
  if ModbusTcpClient is None:
    raise HTTPException(status_code=501, detail='Dependencia pymodbus nao instalada')

  rows = query(
    (
      'SELECT id, plant_id, modbus_id, model_file '
      'FROM devices WHERE id = %s'
    ),
    (device_id,),
  )
  device = rows[0] if rows else devices_cache.get(device_id)
  if not device:
    raise HTTPException(status_code=404, detail='Dispositivo nao encontrado')

  plant_rows = query('SELECT hostname FROM plants WHERE id = %s', (device['plant_id'],))
  hostname = plant_rows[0]['hostname'] if plant_rows else plants_cache.get(device['plant_id'], {}).get('hostname', '')
  if not hostname:
    raise HTTPException(status_code=404, detail='Planta nao encontrada')
  if 'COM' in hostname or 'tty' in hostname:
    raise HTTPException(status_code=400, detail='Escrita RTU nao suportada nesta rota')
  host, port = parse_tcp_hostname(hostname)

  model_file = device.get('model_file')
  if not model_file:
    raise HTTPException(status_code=400, detail='Modelo do dispositivo nao configurado')
  swap_words = should_swap_words(model_file)
  model_path = resolve_model_path(model_file)
  mapping = parse_modbus_write_map(model_path)
  if not mapping:
    raise HTTPException(status_code=400, detail='Mapa de escrita vazio')

  requested_code = normalize_write_code(body.code)
  entry = mapping.get(requested_code)
  if entry is None:
    normalized = requested_code.lower()
    for key, value in mapping.items():
      if key.lower() == normalized:
        entry = value
        requested_code = key
        break
  if entry is None:
    raise HTTPException(status_code=404, detail='Variavel nao encontrada no modelo')

  function_code = int(entry['function_code'])
  offset = int(entry['offset'])
  length = int(entry['length'])
  unit_id = int(device['modbus_id'])

  client = ModbusTcpClient(host=host, port=port, timeout=2.0)
  if not client.connect():
    raise HTTPException(status_code=502, detail='Falha ao conectar dispositivo')

  try:
    if function_code == 5:
      coil_value = parse_coil_value(body.value)
      response = client.write_coil(offset, coil_value, slave=unit_id)
      if response is None:
        raise HTTPException(status_code=504, detail='Sem resposta do dispositivo')
      if response.isError():
        raise HTTPException(status_code=502, detail=str(response))
    else:
      numeric_value = parse_numeric_value(body.value)
      registers = encode_registers(
        numeric_value,
        length,
        entry.get('decimals'),
        swap_words=swap_words,
        signed=entry.get('signed'),
      )
      if function_code == 6 and length > 1:
        for idx, register in enumerate(registers):
          response = client.write_register(offset + idx, register, slave=unit_id)
          if response is None:
            raise HTTPException(status_code=504, detail='Sem resposta do dispositivo')
          if response.isError():
            raise HTTPException(status_code=502, detail=str(response))
      elif function_code == 6:
        response = client.write_register(offset, registers[0], slave=unit_id)
        if response is None:
          raise HTTPException(status_code=504, detail='Sem resposta do dispositivo')
        if response.isError():
          raise HTTPException(status_code=502, detail=str(response))
      elif function_code == 16:
        response = client.write_registers(offset, registers, slave=unit_id)
        if response is None:
          raise HTTPException(status_code=504, detail='Sem resposta do dispositivo')
        if response.isError():
          raise HTTPException(status_code=502, detail=str(response))
      else:
        raise HTTPException(status_code=400, detail=f'Funcao de escrita nao suportada: {function_code}')
  finally:
    client.close()

  insert_audit_log('variavel_escrita', 'device_variables', {
    'device_id': device_id,
    'code': requested_code,
    'function_code': function_code,
    'offset': offset,
    'length': length,
  })
  return {
    'status': 'ok',
    'device_id': device_id,
    'code': requested_code,
    'function_code': function_code,
    'offset': offset,
    'length': length,
  }


@app.get('/api/devices/{device_id}/telemetry/latest')
def get_latest_device_telemetry(device_id: int):
  rows = fetch_latest_telemetry(device_id)
  return {'device_id': device_id, 'readings': rows}


@app.get('/api/devices/{device_id}/telemetry')
def get_device_telemetry(
  device_id: int,
  metrics: str | None = Query(default=None),
  start: str | None = Query(default=None),
  end: str | None = Query(default=None),
  limit: int = Query(default=1000, ge=1, le=10000),
):
  metric_list = [item.strip() for item in (metrics or '').split(',') if item.strip()]
  start_dt = parse_iso_datetime(start)
  end_dt = parse_iso_datetime(end)
  params: list[Any] = [device_id]
  where_clauses = ['device_id = %s']
  if metric_list:
    where_clauses.append('metric IN (%s)' % ','.join(['%s'] * len(metric_list)))
    params.extend(metric_list)
  if start_dt:
    where_clauses.append('captured_at >= %s')
    params.append(start_dt)
  if end_dt:
    where_clauses.append('captured_at <= %s')
    params.append(end_dt)
  sql = (
    'SELECT metric, value, captured_at '
    'FROM telemetry '
    f'WHERE {" AND ".join(where_clauses)} '
    'ORDER BY captured_at ASC '
    'LIMIT %s'
  )
  params.append(limit)
  rows = query(sql, tuple(params))
  return {'device_id': device_id, 'data': rows or []}


def poll_devices_forever() -> None:
  if ModbusTcpClient is None:
    logger.warning('Poller desativado: pymodbus nao instalado.')
    return
  next_due_by_device: dict[int, dict[Literal['fast', 'medium', 'slow'], float]] = {}
  last_audit_at = 0.0
  while not poller_stop.is_set():
    loop_started = datetime.utcnow().timestamp()
    active = (loop_started - last_user_activity) <= USER_ACTIVITY_WINDOW_SECONDS
    interval_map = POLL_PRIORITY_INTERVALS_ACTIVE if active else POLL_PRIORITY_INTERVALS_IDLE
    default_wait = ACTIVE_POLL_INTERVAL_SECONDS if active else IDLE_POLL_INTERVAL_SECONDS
    try:
      global last_retention_cleanup
      now_ts = datetime.utcnow().timestamp()
      if (
        last_retention_cleanup is None
        or now_ts - last_retention_cleanup >= int(settings.retention_cleanup_interval_seconds)
      ):
        cleanup_telemetry_tables()
        last_retention_cleanup = now_ts

      plants = query('SELECT id, hostname FROM plants ORDER BY id ASC') or list(plants_cache.values())
      active_device_ids: set[int] = set()
      for plant in plants:
        plant_id = plant.get('id')
        devices = query('SELECT id FROM devices WHERE plant_id = %s', (plant_id,)) or [
          device for device in devices_cache.values() if device.get('plant_id') == plant_id
        ]
        for device in devices:
          device_id_raw = device['id'] if isinstance(device, dict) else device.get('id')
          try:
            device_id = int(device_id_raw)
          except (TypeError, ValueError):
            continue
          if not device_id:
            continue
          active_device_ids.add(device_id)
          schedule = next_due_by_device.get(device_id)
          if schedule is None:
            seed_now = datetime.utcnow().timestamp()
            schedule = {
              'fast': seed_now,
              'medium': seed_now + 0.1,
              'slow': seed_now + 0.2,
            }
            next_due_by_device[device_id] = schedule

          for read_priority in READ_PRIORITY_ORDER:
            due_at = float(schedule.get(read_priority, 0.0))
            priority_now = datetime.utcnow().timestamp()
            if priority_now < due_at:
              continue
            persist_readings = read_priority == 'slow'
            try:
              collect_device_readings(
                device_id,
                scope='dashboard',
                priority=read_priority,
                persist_readings=persist_readings,
                include_latest=False,
              )
            except HTTPException as exc:
              logger.warning(
                'Falha ao ler device %s prioridade %s: %s',
                device_id,
                read_priority,
                exc.detail,
              )
            except Exception as exc:  # noqa: BLE001
              logger.warning(
                'Falha ao ler device %s prioridade %s: %s',
                device_id,
                read_priority,
                exc,
              )
            schedule[read_priority] = datetime.utcnow().timestamp() + float(interval_map[read_priority])

      stale_ids = [device_id for device_id in next_due_by_device if device_id not in active_device_ids]
      for device_id in stale_ids:
        next_due_by_device.pop(device_id, None)

      audit_now = datetime.utcnow().timestamp()
      if audit_now - last_audit_at >= 60:
        insert_audit_log('poller_plantas_executado', 'devices', {
          'plants': len(plants),
          'devices': len(active_device_ids),
          'active': active,
        })
        last_audit_at = audit_now
    except Exception as exc:  # noqa: BLE001
      logger.warning('Erro no poller: %s', exc)

    wait_now = datetime.utcnow().timestamp()
    next_due: float | None = None
    for schedule in next_due_by_device.values():
      for read_priority in READ_PRIORITY_ORDER:
        due_at = float(schedule.get(read_priority, wait_now + default_wait))
        if next_due is None or due_at < next_due:
          next_due = due_at
    if next_due is None:
      wait_seconds = default_wait
    else:
      wait_seconds = max(0.05, min(default_wait, next_due - wait_now))
    poller_stop.wait(wait_seconds)


@app.on_event('startup')
def start_poller() -> None:
  ensure_runtime_selection_tables()
  ensure_runtime_plant_columns()
  global poller_thread
  if poller_thread and poller_thread.is_alive():
    return
  poller_stop.clear()
  poller_thread = threading.Thread(target=poll_devices_forever, daemon=True)
  poller_thread.start()


@app.on_event('shutdown')
def stop_poller() -> None:
  poller_stop.set()


class DeviceUpdate(BaseModel):
  name: str | None = None
  model_file: str | None = None


@app.put('/api/devices/{device_id}')
def update_device(device_id: int, body: DeviceUpdate):
  updates: list[str] = []
  params: list[Any] = []
  if body.name is not None:
    updates.append('name = %s')
    params.append(body.name)
  if body.model_file is not None:
    resolve_model_path(body.model_file)
    updates.append('model_file = %s')
    params.append(body.model_file)
  if not updates:
    raise HTTPException(status_code=400, detail='Nada para atualizar')
  params.append(device_id)
  updated = execute(f'UPDATE devices SET {", ".join(updates)} WHERE id = %s', tuple(params))
  if updated is None:
    raise HTTPException(status_code=500, detail='Nao foi possivel atualizar o device')
  if body.model_file is not None:
    device_rows = query('SELECT device_code FROM devices WHERE id = %s', (device_id,))
    device_code = device_rows[0]['device_code'] if device_rows else None
    upsert_device_asset(device_id, body.model_file, device_code)
  insert_audit_log('device_atualizado', 'devices', {
    'device_id': device_id,
    'name': body.name,
    'model_file': body.model_file,
  })
  return {'status': 'ok'}


@app.post('/api/scans')
def start_scan(body: ScanRequest):
  if ModbusTcpClient is None or ModbusSerialClient is None:
    raise HTTPException(status_code=501, detail='Dependencia pymodbus nao instalada')

  session_id = insert_scan_session(body.protocol, body.model_dump())
  results: list[dict[str, Any]] = []
  total_attempts = 0

  try:
    if body.protocol == 'tcp':
      for ip in iter_ip_range(body.start_ip or '', body.end_ip or ''):
        client = ModbusTcpClient(host=ip, port=body.port, timeout=body.timeout)
        if not client.connect():
          insert_scan_log(session_id, 'warning', 'Falha ao conectar TCP', {'ip': ip, 'port': body.port})
          for unit_id in range(body.unit_id_start, body.unit_id_end + 1):
            for function_code in body.function_codes:
              result = {
                'connection': f'TCP IP: {ip}:{body.port}',
                'ip': ip,
                'port': body.port,
                'unit_id': unit_id,
                'function_code': function_code,
                'offset': body.offset,
                'length': body.length,
                'status': 'No connection',
                'response_ms': 0,
                'error': 'Falha ao conectar TCP',
                'registers': None,
              }
              result_id = insert_scan_result(session_id, result)
              result['id'] = result_id or result.get('id')
              results.append(result)
          client.close()
          continue
        connection_label = f'TCP IP: {ip}:{body.port}'
        for unit_id in range(body.unit_id_start, body.unit_id_end + 1):
          for function_code in body.function_codes:
            length = resolve_length(function_code, body.length, body.length_map)
            status, registers, error, response_ms = read_modbus(client, unit_id, function_code, body.offset, length)
            total_attempts += 1
            result = {
              'connection': connection_label,
              'ip': ip,
              'port': body.port,
              'unit_id': unit_id,
              'function_code': function_code,
              'offset': body.offset,
              'length': length,
              'status': status,
              'response_ms': response_ms,
              'error': error,
              'registers': registers,
            }
            result_id = insert_scan_result(session_id, result)
            result['id'] = result_id or result.get('id')
            results.append(result)
        client.close()
    else:
      client = ModbusSerialClient(
        method='rtu',
        port=body.com_port,
        baudrate=body.baud_rate,
        parity=body.parity,
        stopbits=body.stop_bits,
        bytesize=body.bytesize,
        timeout=body.timeout,
      )
      if not client.connect():
        insert_scan_log(session_id, 'error', 'Falha ao conectar RTU', {'port': body.com_port})
      else:
        connection_label = f'RTU: {body.com_port}'
        for unit_id in range(body.unit_id_start, body.unit_id_end + 1):
          for function_code in body.function_codes:
            length = resolve_length(function_code, body.length, body.length_map)
            status, registers, error, response_ms = read_modbus(client, unit_id, function_code, body.offset, length)
            total_attempts += 1
            result = {
              'connection': connection_label,
              'ip': None,
              'port': None,
              'unit_id': unit_id,
              'function_code': function_code,
              'offset': body.offset,
              'length': length,
              'status': status,
              'response_ms': response_ms,
              'error': error,
              'registers': registers,
            }
            result_id = insert_scan_result(session_id, result)
            result['id'] = result_id or result.get('id')
            results.append(result)
        client.close()
  except Exception as exc:  # noqa: BLE001
    insert_scan_log(session_id, 'error', 'Falha durante scan', {'error': str(exc)})
    finalize_scan_session(session_id, total_attempts, status='failed')
    raise HTTPException(status_code=500, detail='Erro ao executar scan Modbus')

  finalize_scan_session(session_id, total_attempts, status='finished')
  return {
    'session_id': session_id,
    'total_attempts': total_attempts,
    'results': results,
  }


@app.post('/api/scans/full')
def start_full_scan(body: FullScanRequest):
  if ModbusTcpClient is None or ModbusSerialClient is None:
    raise HTTPException(status_code=501, detail='Dependencia pymodbus nao instalada')

  session_config = {**body.model_dump(), 'full_scan': True}
  session_id = insert_scan_session(body.protocol, session_config)
  insert_scan_log(session_id, 'info', 'Full scan iniciado', {
    'protocol': body.protocol,
    'host': body.host,
    'port': body.port,
    'unit_id': body.unit_id,
    'model_file': body.model_file,
  })

  results: list[dict[str, Any]] = []
  total_attempts = 0

  try:
    model_path = resolve_model_path(body.model_file)
    mapping = parse_modbus_map(model_path, body.length_map)
    mapping = [entry for entry in mapping if entry['function_code'] in body.function_codes]
    insert_scan_log(session_id, 'info', 'Mapa Modbus carregado', {
      'entries': len(mapping),
      'model_file': body.model_file,
    })
    if not mapping:
      insert_scan_log(session_id, 'warning', 'Nenhum endereco encontrado no modelo', {'model_file': body.model_file})
      finalize_scan_session(session_id, total_attempts, status='failed')
      raise HTTPException(status_code=400, detail='Modelo XML sem enderecos validos')
    if body.protocol == 'tcp':
      client = ModbusTcpClient(host=body.host, port=body.port, timeout=body.timeout)
      if not client.connect():
        insert_scan_log(session_id, 'error', 'Falha ao conectar TCP', {'ip': body.host, 'port': body.port})
        finalize_scan_session(session_id, total_attempts, status='failed')
        raise HTTPException(status_code=502, detail='Falha ao conectar TCP')
      connection_label = f'TCP IP: {body.host}:{body.port}'
    else:
      client = ModbusSerialClient(
        method='rtu',
        port=body.com_port,
        baudrate=body.baud_rate,
        parity=body.parity,
        stopbits=body.stop_bits,
        bytesize=body.bytesize,
        timeout=body.timeout,
      )
      if not client.connect():
        insert_scan_log(session_id, 'error', 'Falha ao conectar RTU', {'port': body.com_port})
        finalize_scan_session(session_id, total_attempts, status='failed')
        raise HTTPException(status_code=502, detail='Falha ao conectar RTU')
      connection_label = f'RTU: {body.com_port}'

    for entry in mapping:
      function_code = entry['function_code']
      offset = entry['offset']
      length = entry['length']
      status, registers, error, response_ms = read_modbus(client, body.unit_id, function_code, offset, length)
      total_attempts += 1
      result = {
        'connection': connection_label,
        'ip': body.host if body.protocol == 'tcp' else None,
        'port': body.port if body.protocol == 'tcp' else None,
        'unit_id': body.unit_id,
        'function_code': function_code,
        'offset': offset,
        'length': length,
        'status': status,
        'response_ms': response_ms,
        'error': error,
        'registers': registers,
        'codes': entry.get('codes', []),
        'address_in': entry.get('address_in'),
      }
      result_id = insert_scan_result(session_id, result)
      result['id'] = result_id or result.get('id')
      results.append(result)
      insert_scan_log(session_id, 'info' if status == 'Good' else 'warning', 'Leitura full scan', {
        'function_code': function_code,
        'offset': offset,
        'length': length,
        'status': status,
        'error': error,
        'codes': entry.get('codes', []),
      })
    client.close()
  except HTTPException:
    raise
  except Exception as exc:  # noqa: BLE001
    insert_scan_log(session_id, 'error', 'Falha durante full scan', {'error': str(exc)})
    finalize_scan_session(session_id, total_attempts, status='failed')
    raise HTTPException(status_code=500, detail='Erro ao executar full scan Modbus')

  finalize_scan_session(session_id, total_attempts, status='finished')
  insert_scan_log(session_id, 'info', 'Full scan finalizado', {'total_attempts': total_attempts})
  return {
    'session_id': session_id,
    'total_attempts': total_attempts,
    'results': results,
  }


@app.get('/api/scans/latest')
def get_latest_scan():
  rows = query('SELECT id, protocol, status, config, started_at, finished_at, total_results FROM scan_sessions ORDER BY id DESC LIMIT 1')
  if rows:
    session = rows[0]
    results = query(
      (
        'SELECT id, connection, ip, port, unit_id, function_code, offset, length, status, response_ms, error, registers '
        'FROM scan_results WHERE session_id = %s ORDER BY id ASC'
      ),
      (session['id'],),
    )
    return {'session': session, 'results': results or []}
  if scan_sessions_cache:
    latest_id = sorted(scan_sessions_cache.keys())[-1]
    session = scan_sessions_cache[latest_id]
    results = scan_results_cache.get(latest_id, [])
    return {'session': session, 'results': results}
  raise HTTPException(status_code=404, detail='Nenhum scan encontrado')


@app.get('/api/scans/{session_id}')
def get_scan_session(session_id: int):
  rows = query('SELECT id, protocol, status, config, started_at, finished_at, total_results FROM scan_sessions WHERE id = %s', (session_id,))
  if rows:
    return rows[0]
  if session_id in scan_sessions_cache:
    return scan_sessions_cache[session_id]
  raise HTTPException(status_code=404, detail='Scan nao encontrado')


@app.get('/api/scans/{session_id}/results')
def list_scan_results(session_id: int):
  rows = query(
    'SELECT id, connection, ip, port, unit_id, function_code, offset, length, status, response_ms, error FROM scan_results WHERE session_id = %s ORDER BY id ASC',
    (session_id,),
  )
  if rows:
    return {'data': rows}
  if session_id in scan_results_cache:
    return {'data': scan_results_cache[session_id]}
  return {'data': []}


@app.get('/api/scans/{session_id}/results/{result_id}')
def get_scan_result(session_id: int, result_id: int):
  rows = query(
    'SELECT id, connection, ip, port, unit_id, function_code, offset, length, status, response_ms, error, registers FROM scan_results WHERE session_id = %s AND id = %s',
    (session_id, result_id),
  )
  if rows:
    return rows[0]
  if session_id in scan_results_cache:
    for result in scan_results_cache[session_id]:
      if result.get('id') == result_id:
        return result
  raise HTTPException(status_code=404, detail='Resultado nao encontrado')


@app.post('/api/ai/analyze')
def analyze(body: AIRequest):
  if not settings.openai_api_key:
    return {
      "source": "stub",
      "root_cause": "Operação simulada sem chave OPENAI_API_KEY.",
      "action": "Configurar a chave e validar o prompt com telemetria real.",
    }
  try:
    from openai import OpenAI  # imported lazily

    client = OpenAI(api_key=settings.openai_api_key)
    prompt = (
      "Analise o alarme abaixo e retorne causa raiz e ação imediata.\n"
      f"Alarme: {body.alarm}.\n"
      f"Telemetria: {body.telemetry or {}}"
    )
    completion = client.responses.create(model=settings.ai_model, input=prompt, max_output_tokens=200)
    text = completion.output_text
    return {"source": settings.ai_model, "root_cause": text, "action": "Ver detalhes no texto."}
  except Exception as exc:  # noqa: BLE001
    logger.error('Erro ao chamar modelo: %s', exc)
    raise HTTPException(status_code=500, detail='Falha ao processar com IA')


if __name__ == '__main__':
  import uvicorn

  uvicorn.run('app.main:app', host='0.0.0.0', port=4000, reload=True)
