#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VENV_DIR="${VENV_DIR:-${PROJECT_ROOT}/be/venv}"
REQUIREMENTS_FILE="${REQUIREMENTS_FILE:-${PROJECT_ROOT}/be/requirements.txt}"

if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

pip install --upgrade pip
pip install -r "$REQUIREMENTS_FILE"

APP_URL="${APP_URL:-http://localhost:8000}"

if [ "$APP_URL" = "http://localhost:8000" ]; then
    echo "Starting local FastAPI server..."
    
    echo "$PROJECT_ROOT"
    cd "$PROJECT_ROOT"
    uvicorn be.app.main:app --host 0.0.0.0 --port 8000 &
    APP_PID=$!
    
    cleanup() {
        echo "Stopping FastAPI server..."
        kill $APP_PID 2>/dev/null || true
    }
    trap cleanup EXIT
    
    echo "Waiting for app to start..."
    max_attempts=30
    attempt=0
    until curl -sf "$APP_URL/docs" > /dev/null 2>&1 || [ $attempt -eq $max_attempts ]; do
        sleep 1
        attempt=$((attempt + 1))
        echo -n "."
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "App failed to start within 30 seconds"
        exit 1
    fi
    
    echo "App started successfully"
fi

python3 "$PROJECT_ROOT/be/tests/smoke_test.py" "$APP_URL"
