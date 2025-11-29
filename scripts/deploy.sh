#!/bin/bash
set -euo pipefail

if [ -z "$RENDER_HOOK" ]; then
    echo "Error: RENDER_HOOK must be set"
    exit 1
fi

curl --fail -X POST "$RENDER_HOOK"

echo "Deploy triggered successfully"