import os
import sys


ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

os.environ.setdefault("ALLOWED_ORIGINS", '["*"]')

from app.main import parse_server_map_devices, resolve_model_reference_to_file  # noqa: E402


def test_server_map_model_selection_for_mpxpro():
    devices = parse_server_map_devices("panifresh_modbus_server_20260106224146.xml")
    target_ids = {3, 4, 8, 9}
    selected = {dev["unit_id"]: dev.get("model_file") for dev in devices if dev["unit_id"] in target_ids}
    assert target_ids.issubset(selected.keys())
    for unit_id in target_ids:
        assert selected[unit_id] == "mpxpro_modbus_amp_trocador.xml"


def test_model_reference_by_device_code():
    codes = {"Po1", "Po2", "Po3", "Po4", "airoff"}
    model_file = resolve_model_reference_to_file("mpxpro_modbus_amp_trocador", codes, prefer_modbus=True)
    assert model_file == "mpxpro_modbus_amp_trocador.xml"
