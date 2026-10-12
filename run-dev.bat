@echo off
echo ==============================================
echo        Starting KaamWale Full Stack App
echo ==============================================

:: Ensure local MongoDB data folder exists
if not exist "%USERPROFILE%\.mongodb_data" (
    mkdir "%USERPROFILE%\.mongodb_data"
)

:: Check MongoDB port 27017, start mongod if not listening
powershell -Command "if (-not (Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue).TcpTestSucceeded) { Start-Process 'C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe' -ArgumentList '--dbpath \"%USERPROFILE%\.mongodb_data\" --bind_ip 127.0.0.1 --port 27017' -WindowStyle Hidden; Write-Host 'MongoDB Server started on port 27017.' } else { Write-Host 'MongoDB is already running on port 27017.' }"

:: Start Backend in a new terminal window
start "KaamWale Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

:: Start Frontend in a new terminal window
start "KaamWale Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Application launched!
echo - Backend API:  http://localhost:5000
echo - Frontend Web: http://localhost:5173
echo ==============================================
