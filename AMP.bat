@echo off
:a
title AMPLink Console
node app.js
echo AMPLink has crashed. Restarting in 30 seconds...
timeout /t 30 >nul 
goto a