@echo off
title LDRP-ITR CE-A Class Command Center Launcher
echo ================================================================
echo    Starting LDRP CE-A Class Command Center (Full-Stack)
echo    Class: Computer Engineering CE-A (78 Students)
echo    Mentors: Prof. Avani Patel and Dr. Hitsh Barot
echo    Class Coordinator: Priyanshu Bharadava (Roll 20)
echo ================================================================
echo.
echo [1/2] Starting Backend Server on http://localhost:5000...
start "LDRP CE-A Backend" cmd /k "cd /d %~dp0server ^& node index.js"
echo [2/2] Starting Frontend on http://localhost:5173...
start "LDRP CE-A Frontend" cmd /k "cd /d %~dp0client ^& npm run dev"
echo.
timeout /t 3 >nul
start http://localhost:5173
