#!/usr/bin/env bash
set -euo pipefail
echo "backup is protected as backup memory"
if git diff --name-only --cached 2>/dev/null | grep -E "^backup/"; then echo "Refusing staged backup memory changes" >&2; exit 1; fi
