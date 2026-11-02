@echo off
title White Mist - Automated MySQL Database Setup
color 0b

echo ====================================================================
echo             WHITE MIST - 1-CLICK MYSQL DATABASE SETUP
echo ====================================================================
echo.

set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin
set DATA_DIR=C:\Users\%USERNAME%\whitemist-mysql-data
set SCRIPT_DIR=%~dp0

if not exist "%MYSQL_BIN%\mysqld.exe" (
    echo [ERROR] Could not find MySQL Server in:
    echo "%MYSQL_BIN%"
    echo.
    echo Please verify where MySQL is installed.
    pause
    exit /b 1
)

echo [Step 1/3] Setting up database storage in:
echo   %DATA_DIR%
echo.

if not exist "%DATA_DIR%" (
    mkdir "%DATA_DIR%"
    echo Initializing fresh MySQL system tables (takes ~5-10 seconds)...
    "%MYSQL_BIN%\mysqld.exe" --initialize-insecure --datadir="%DATA_DIR%" --console
    if errorlevel 1 (
        echo [ERROR] MySQL initialization failed.
        pause
        exit /b 1
    )
    echo System tables initialized successfully!
) else (
    echo Database storage directory already exists. Skipping initialization.
)

echo.
echo [Step 2/3] Starting MySQL background engine on port 3306...
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 1 /nobreak >nul
start "White Mist MySQL Server" /min "%MYSQL_BIN%\mysqld.exe" --datadir="%DATA_DIR%" --port=3306 --console

echo Waiting for MySQL engine to accept connections...
for /l %%i in (1, 1, 15) do (
    "%MYSQL_BIN%\mysqladmin.exe" -u root -P 3306 ping >nul 2>&1
    if not errorlevel 1 (
        goto :mysql_ready
    )
    timeout /t 1 /nobreak >nul
)

:mysql_ready
echo MySQL Server is online and accepting connections!

echo.
echo [Step 3/3] Creating database 'whitemist_dishwasher_db' and importing tables...
"%MYSQL_BIN%\mysql.exe" -u root -P 3306 -e "CREATE DATABASE IF NOT EXISTS whitemist_dishwasher_db;"
if errorlevel 1 (
    echo [ERROR] Could not create database.
    pause
    exit /b 1
)

echo Importing tables from schema.sql...
"%MYSQL_BIN%\mysql.exe" -u root -P 3306 whitemist_dishwasher_db < "%SCRIPT_DIR%backend\src\database\schema.sql"

echo.
echo ====================================================================
echo                     [SUCCESS] SETUP COMPLETE!
echo ====================================================================
echo.
echo  Database Server: 127.0.0.1 (localhost)
echo  Port:            3306
echo  Username:        root
echo  Password:        (none / blank)
echo  Database Name:   whitemist_dishwasher_db
echo.
echo  Now switch to MySQL Workbench:
echo  1. In the "Setup New Connection" window, set Password to BLANK (leave empty).
echo  2. Click "Test Connection" -> It will say "Successfully connected"!
echo  3. Click OK to connect and see all tables ready!
echo.
echo ====================================================================
pause

