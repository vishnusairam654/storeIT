@echo off
echo ==========================================
echo   Installing with React 18 + 3D Libraries
echo ==========================================
echo.
echo Cleaning old files...
del package-lock.json 2>nul
del yarn.lock 2>nul

echo.
echo Removing node_modules...
rmdir /s /q node_modules 2>nul

echo.
echo Installing ALL dependencies (this takes 1-2 minutes)...
call npm install

echo.
echo ==========================================
echo      Installation Complete!
echo ==========================================
echo.
echo Restart your server: npm run dev
pause
