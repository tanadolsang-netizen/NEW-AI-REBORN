@echo off
echo Starting Astral Backend MVP...
echo.
echo Step 1: Start backend
start "Astral Backend" cmd /k "cd /d C:\Users\70098372\Documents\Obsidian Vault\astral-backend && C:\Users\70098372\AppData\Local\Programs\Python\Python313\python.exe -m uvicorn src.main:app --host 127.0.0.1 --port 8000"
timeout /t 3 /nobreak >nul

echo Step 2: Start frontend
start "Astral Frontend" cmd /k "cd /d C:\Users\70098372\Documents\Obsidian Vault\astral-backend\frontend && npm run dev"

echo.
echo MVP running:
echo - Backend: http://127.0.0.1:8000
echo - Frontend: http://localhost:5173
echo - Health:   http://127.0.0.1:8000/health/ready
pause
