#!/usr/bin/env bash
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"
echo "Starting Astral Backend MVP..."
echo "Backend: http://127.0.0.1:8000"
echo "Frontend: http://localhost:5173"
python3 -m uvicorn src.main:app --host 127.0.0.1 --port 8000 &
cd frontend && npm run dev
