@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 exit /b 1
)
echo.
echo Starting Word Antakshri...
echo Open http://localhost:5000 in your browser.
echo.
npm start
