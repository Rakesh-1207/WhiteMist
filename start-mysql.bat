@echo off
title White Mist - Start MySQL Database
color 0a

echo Starting MySQL Database for White Mist...
set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin
set DATA_DIR=C:\Users\%USERNAME%\whitemist-mysql-data

if not exist "%DATA_DIR%" (
    echo [NOTICE] Database directory not found. Running initial setup first...
    call "%~dp0setup-mysql.bat"
    exit /b 0
)

"%MYSQL_BIN%\mysqladmin.exe" -u root -P 3306 ping >nul 2>&1
if not errorlevel 1 (
    echo MySQL is already running on port 3306!
    timeout /t 3
    exit /b 0
)

start "White Mist MySQL Server" /min "%MYSQL_BIN%\mysqld.exe" --datadir="%DATA_DIR%" --port=3306 --console
echo MySQL server started on port 3306.
timeout /t 2 >nul
exit /b 0

