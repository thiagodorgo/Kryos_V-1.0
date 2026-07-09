#!/usr/bin/env bash
set -euo pipefail
cmd="${*:-}"
if printf "%s" "$cmd" | grep -E "rm -rf|terraform apply|kubectl delete|kubectl apply|backup/"; then echo "Blocked dangerous command or protected backup path" >&2; exit 1; fi
