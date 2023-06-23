@echo off
title AMPLink Discord Bridge
:a
node ./modules/discord/bot.js
echo AMPLink Discord Bridge has crashed. Restarting in 30 seconds...
timeout /t 30 >nul 
goto a