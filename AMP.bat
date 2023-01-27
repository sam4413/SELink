@echo off
:a
title AMPLink Console
node app.js
echo AMPLink has crashed. Restarting...
timeout /t 1 >nul 
goto a