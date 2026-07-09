#!/usr/bin/env bash
set -euo pipefail
echo "Conservative secret validation placeholder; full validation will be hardened later."
files=$(git diff --name-only --cached 2>/dev/null | grep -v "^secrets/" || true)
[ -z "$files" ] && exit 0
if printf "%s
" "$files" | xargs -r grep -E "(PASSWORD|SECRET|TOKEN|PRIVATE KEY)="; then echo "Potential secret pattern found" >&2; exit 1; fi
