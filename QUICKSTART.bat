@echo off
REM AquaFlow AI - Quick Start Script for Windows
REM Run this to get the hackathon demo up in minutes!

echo.
echo ==================================
echo 🌊 AquaFlow AI - Quick Start
echo ==================================
echo.

REM Step 1: Check prerequisites
echo ✓ Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18+
    exit /b 1
)

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker not found. Please install Docker Desktop
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found. Please install npm
    exit /b 1
)

echo ✅ All prerequisites found
echo.

REM Step 2: Install dependencies
echo 📦 Installing dependencies... (this may take a minute)
call npm run install:all >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Step 3: Start infrastructure
echo 🐳 Starting Docker containers...
start /B npm run dev:infra >nul 2>&1

REM Wait for containers to be healthy
echo ⏳ Waiting for containers (30 seconds)...
timeout /t 30 /nobreak

REM Check if Docker is running
docker ps | find "aquaflow_postgres" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to start Docker containers
    exit /b 1
)

echo ✅ Containers running
echo.

REM Step 4: Show next steps
echo 🎉 Setup complete!
echo.
echo Next steps:
echo ===========
echo.
echo 1️⃣  Open PowerShell/Command Prompt 1 (Backend^):
echo    cd backend
echo    npm run dev
echo.
echo 2️⃣  Open PowerShell/Command Prompt 2 (Frontend^):
echo    cd frontend
echo    npm run dev
echo.
echo 3️⃣  Open your browser:
echo    http://localhost:3000
echo.
echo 🎬 Demo Flow:
echo    - Show dashboard (normal operation^)
echo    - Simulate leak (block pump inlet^)
echo    - Watch alert + valve auto-close
echo    - Recover (unblock inlet^)
echo.
echo 📖 Full guide: See README.md
echo.
pause
