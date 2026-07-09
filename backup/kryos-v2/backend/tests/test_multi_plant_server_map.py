import os
import sys


ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

os.environ.setdefault("ALLOWED_ORIGINS", '["*"]')

from app import main  # noqa: E402


def test_load_server_modbus_map_for_plant_uses_plant_file(monkeypatch):
    captured: list[str | None] = []

    def fake_query(sql, params=None):  # noqa: ANN001
        if "SELECT server_map_file FROM plants" in sql:
            return [{"server_map_file": "hiperpan_modbus_server_20260219201505.xml"}]
        return []

    def fake_load(server_map_file):  # noqa: ANN001
        captured.append(server_map_file)
        return {1: {"sample": {"offset": 0}}}

    monkeypatch.setattr(main, "query", fake_query)
    monkeypatch.setattr(main, "load_server_modbus_map_for_file", fake_load)

    resolved = main.load_server_modbus_map_for_plant(9)
    assert resolved == {1: {"sample": {"offset": 0}}}
    assert captured == ["hiperpan_modbus_server_20260219201505.xml"]


def test_import_server_map_does_not_clear_database(monkeypatch):
    body = main.ServerMapScanRequest(
        host="127.0.0.1",
        port=502,
        server_map_file="panifresh_modbus_server_20260106224146.xml",
        plant_name="Panifresh",
        plant_id=15,
    )
    expected_devices = [
        {
            "unit_id": 1,
            "name": "Device 1",
            "model_file": "pjeasy.xml",
            "device_code": "pj",
            "variables": [{"code": "A"}],
        }
    ]
    called = {"clear": False, "server_map_file": None}

    def fake_clear_database_data():
        called["clear"] = True

    def fake_get_or_create_plant(name, hostname, plant_id=None, server_map_file=None, reuse_by_hostname=True):  # noqa: ANN001
        called["server_map_file"] = server_map_file
        return 15

    monkeypatch.setattr(main, "parse_server_map_devices", lambda _: expected_devices)
    monkeypatch.setattr(main, "ensure_runtime_plant_columns", lambda: None)
    monkeypatch.setattr(main, "clear_database_data", fake_clear_database_data)
    monkeypatch.setattr(main, "get_or_create_plant", fake_get_or_create_plant)
    monkeypatch.setattr(main, "insert_scan_session", lambda *_args, **_kwargs: 99)
    monkeypatch.setattr(main, "upsert_server_map_devices_for_plant", lambda *_args, **_kwargs: expected_devices)
    monkeypatch.setattr(main, "finalize_scan_session", lambda *_args, **_kwargs: None)
    monkeypatch.setattr(main, "insert_scan_log", lambda *_args, **_kwargs: None)
    monkeypatch.setattr(main, "insert_audit_log", lambda *_args, **_kwargs: None)

    response = main.import_server_map(body)
    assert response["status"] == "ok"
    assert response["plant_id"] == 15
    assert called["clear"] is False
    assert called["server_map_file"] == "panifresh_modbus_server_20260106224146.xml"


def test_insert_device_variables_applies_plant_map_override(monkeypatch):
    inserted_rows = []

    def fake_query(sql, params=None):  # noqa: ANN001
        if "SELECT plant_id, modbus_id FROM devices" in sql:
            return [{"plant_id": 7, "modbus_id": 3}]
        if "SELECT modbus_id FROM devices" in sql:
            return [{"modbus_id": 3}]
        return []

    def fake_execute(_sql, params=None, many=False):  # noqa: ANN001
        if many and params:
            inserted_rows.extend(list(params))
        return 1

    monkeypatch.setattr(main, "query", fake_query)
    monkeypatch.setattr(main, "execute", fake_execute)
    monkeypatch.setattr(
        main,
        "load_server_modbus_map_for_plant",
        lambda _plant_id: {
            3: {
                "temp": {
                    "offset": 55,
                    "address_in": "400056",
                    "function_code": 4,
                }
            }
        },
    )
    monkeypatch.setattr(main, "load_server_modbus_map", lambda: {})

    entries = [
        {
            "codes": ["TEMP"],
            "function_code": 3,
            "offset": 10,
            "length": 1,
            "address_in": "400011",
            "measure_unit": "°C",
            "decimals": 1,
        }
    ]

    main.insert_device_variables(123, entries, {"TEMP": "Temperatura"})
    assert len(inserted_rows) == 1
    row = inserted_rows[0]
    assert row[3] == 4
    assert row[4] == 55
    assert row[6] == "400056"


def test_collect_device_readings_filters_variables_using_plant_server_map(monkeypatch):
    selected_codes: list[str] = []

    class DummyClient:
        def connect(self):
            return True

        def close(self):
            return None

    def fake_query(sql, params=None):  # noqa: ANN001
        if "SELECT id, plant_id, modbus_id, model_file FROM devices" in sql:
            return [{"id": 4, "plant_id": 88, "modbus_id": 2, "model_file": None}]
        if "SELECT hostname FROM plants" in sql:
            return [{"hostname": "127.0.0.1:502"}]
        if "FROM device_variables WHERE device_id = %s ORDER BY id ASC" in sql:
            return [
                {
                    "id": 1,
                    "code": "A",
                    "label": "A",
                    "function_code": 3,
                    "offset": 0,
                    "length": 1,
                    "address_in": "400001",
                    "measure_unit": "",
                    "decimals": 0,
                },
                {
                    "id": 2,
                    "code": "B",
                    "label": "B",
                    "function_code": 3,
                    "offset": 1,
                    "length": 1,
                    "address_in": "400002",
                    "measure_unit": "",
                    "decimals": 0,
                },
            ]
        return []

    def fake_build_read_batches(variables, max_gap=0):  # noqa: ANN001
        selected_codes.extend([item["code"] for item in variables])
        return []

    monkeypatch.setattr(main, "query", fake_query)
    monkeypatch.setattr(main, "ModbusTcpClient", lambda **_kwargs: DummyClient())
    monkeypatch.setattr(
        main,
        "load_server_modbus_map_for_plant",
        lambda _plant_id: {2: {"a": {"offset": 0, "address_in": "400001", "function_code": 3}}},
    )
    monkeypatch.setattr(main, "load_server_modbus_map", lambda: {})
    monkeypatch.setattr(main, "build_read_batches", fake_build_read_batches)
    monkeypatch.setattr(main, "fetch_latest_telemetry", lambda _device_id: [])

    payload = main.collect_device_readings(
        4,
        scope="all",
        persist_readings=False,
        include_latest=False,
    )
    assert payload["device_id"] == 4
    assert selected_codes == ["A"]
