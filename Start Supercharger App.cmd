@echo off
title Supercharger Hunter 2026
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs"
echo De app opent zo in je browser. Laat dit venster open zolang je de app gebruikt.
start "" http://localhost:8765
npx -y http-server -p 8765 -c-1 .
