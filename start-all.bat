@echo off
echo ===================================================
echo   Document Expiry & Reminder System - Quick Starter
echo ===================================================
echo.
echo [1/2] Starting backend Express server...
start cmd /k "echo Starting backend... && cd backend && npm run dev"

echo [2/2] Starting React Vite frontend...
start cmd /k "echo Starting frontend... && cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate terminal windows.
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo Press any key to close this starter script.
pause > null
