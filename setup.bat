@echo off
setlocal enabledelayedexpansion

echo ==============================================================================
echo       JobGuard Pro AI - One-Time Automated Setup Wizard
echo ==============================================================================
echo.

cd /d "%~dp0"

:: 1. Check Python
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.9+ from https://www.python.org/downloads/
    echo Make sure to check the box "Add Python to PATH" during installation.
    pause
    exit /b 1
)
python --version

:: 2. Check Node.js
echo.
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js (LTS version) from https://nodejs.org/
    pause
    exit /b 1
)
node --version

:: 3. Setup Python Virtual Environment and Backend Dependencies
echo.
echo [3/4] Setting up Python virtual environment and ML backend dependencies...
if not exist ".venv" (
    echo Creating virtual environment (.venv)...
    python -m venv .venv
)
call .venv\Scripts\activate.bat
echo Installing required Python packages (FastAPI, Scikit-Learn, XGBoost, Pandas, Gemini OCR, etc.)...
python -m pip install --upgrade pip
pip install -r requirements.txt

:: 4. Setup React Frontend Dependencies
echo.
echo [4/4] Setting up React Frontend dependencies...
cd /d "%~dp0\frontend"
call npm install

echo.
echo ==============================================================================
echo   SUCCESS! All dependencies and environments have been set up successfully.
echo ==============================================================================
echo.
echo To run the application at any time, simply double-click:
echo   1. start_backend.bat   (Starts ML API at http://localhost:8000)
echo   2. start_frontend.bat  (Starts React Web UI at http://localhost:3000)
echo.
pause
