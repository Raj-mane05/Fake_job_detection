@echo off
echo ============================================================
echo   Starting Job Posting Analyzer - FastAPI ML Backend (Port 8000)
echo ============================================================
cd /d "%~dp0"
call .venv\Scripts\activate.bat
python app.py
pause
