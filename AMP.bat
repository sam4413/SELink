@echo off
:a
title AMPLink Console
node app.js
echo AMPLink has crashed. Press any key to restart, or close the application.
timeout /t 1 >nul
goto a