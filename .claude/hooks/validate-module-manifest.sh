#!/usr/bin/env bash
set -euo pipefail
missing=0
for d in services/* shared/* edge/edge-collector; do [ -d "$d" ] || continue; [ -f "$d/module.yaml" ] || { echo "Missing module.yaml: $d" >&2; missing=1; }; done
exit "$missing"
