import os
import sys


ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

os.environ.setdefault("ALLOWED_ORIGINS", '["*"]')

from app.main import (  # noqa: E402
    build_read_batches,
    filter_variables_for_priority,
    normalize_read_priority,
    resolve_variable_priority,
)


def _var(code: str, offset: int, function_code: int = 3, length: int = 1) -> dict:
    return {
        "id": offset,
        "code": code,
        "label": code,
        "function_code": function_code,
        "offset": offset,
        "length": length,
        "address_in": str(offset + 1),
        "measure_unit": "",
        "decimals": 1,
    }


def test_build_read_batches_respects_gap_for_register_reads():
    variables = [
        _var("po1", 100, function_code=3),
        _var("po2", 102, function_code=3),
        _var("po3", 103, function_code=3),
    ]
    batches = build_read_batches(variables, max_gap=2)
    assert len(batches) == 1
    assert batches[0]["start"] == 100
    assert batches[0]["length"] == 4


def test_priority_detection_and_filtering():
    variables = [
        _var("ALARM_ACTIVE", 10, function_code=1),
        _var("Po1", 20, function_code=3),
        _var("temp_evap", 30, function_code=3),
        _var("s_setpointwork", 40, function_code=3),
    ]

    priorities = {item["code"]: resolve_variable_priority(item) for item in variables}
    assert priorities["ALARM_ACTIVE"] == "fast"
    assert priorities["Po1"] == "fast"
    assert priorities["temp_evap"] == "medium"
    assert priorities["s_setpointwork"] == "slow"

    fast_rows = filter_variables_for_priority(variables, "fast")
    slow_rows = filter_variables_for_priority(variables, "slow")
    assert {row["code"] for row in fast_rows} == {"ALARM_ACTIVE", "Po1"}
    assert {row["code"] for row in slow_rows} == {"s_setpointwork"}


def test_normalize_read_priority_accepts_known_values_only():
    assert normalize_read_priority("FAST") == "fast"
    assert normalize_read_priority(" medium ") == "medium"
    assert normalize_read_priority("slow") == "slow"
    assert normalize_read_priority("urgent") is None
