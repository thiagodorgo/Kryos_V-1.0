@echo off
setlocal enabledelayedexpansion

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"

set "HOST=127.0.0.1"
set "PORT=4001"
set "PORT_LOCKED=0"
if not "%KRYOS_HOST%"=="" set "HOST=%KRYOS_HOST%"
if not "%KRYOS_PORT%"=="" (
  set "PORT=%KRYOS_PORT%"
  set "PORT_LOCKED=1"
)

rem Fecha listeners nas portas padrao do Kryos para evitar conflitos.
set "PORT_KILL_LIST=4001 4002 4003"
if not "%PORT%"=="" set "PORT_KILL_LIST=%PORT_KILL_LIST% %PORT%"
for %%P in (%PORT_KILL_LIST%) do (
  call :kill_port %%P
)
call :wait_port_free %PORT% 3

set "PYTHON=python"
if exist "%BACKEND_DIR%\.venv\Scripts\python.exe" (
  set "PYTHON=%BACKEND_DIR%\.venv\Scripts\python.exe"
)

if not exist "%BACKEND_DIR%\.venv\Scripts\python.exe" (
  echo [WARN] Venv nao encontrada em backend\.venv. Usando python do sistema.
)

set "FRONTEND_CMD=npm run start"
if not exist "%FRONTEND_DIR%\node_modules" (
  set "FRONTEND_CMD=npm install ^&^& npm run start"
)

set "PORT_SELECTED=0"
set "PORT_RANGE_START=4001"
set "PORT_RANGE_END=4010"
if "%PORT_LOCKED%"=="1" (
  call :kill_port %PORT%
  call :wait_port_free %PORT% 3
  set "PORT_RANGE_START=%PORT%"
)
for /L %%P in (%PORT_RANGE_START%,1,%PORT_RANGE_END%) do (
  netstat -ano | findstr /R /C:":%%P " | findstr /R /C:"LISTENING" >nul
  if errorlevel 1 (
    set "PORT=%%P"
    set "PORT_SELECTED=1"
    goto :port_ready
  )
)
if "%PORT_SELECTED%"=="0" (
  echo [ERRO] Nenhuma porta disponivel entre %PORT_RANGE_START% e %PORT_RANGE_END%.
  echo [INFO] PIDs em uso:
  for /L %%P in (%PORT_RANGE_START%,1,%PORT_RANGE_END%) do (
    netstat -ano | findstr /R /C:":%%P " | findstr /R /C:"LISTENING"
  )
  pause
  exit /b 1
)
:port_ready

set "KRYOS_HOST=%HOST%"
set "KRYOS_PORT=%PORT%"

echo Iniciando backend em nova janela...
start "Kryos Backend" /D "%BACKEND_DIR%" cmd /k ""%BACKEND_DIR%\start-backend.bat""

echo Iniciando frontend em nova janela...
start "Kryos Frontend" /D "%FRONTEND_DIR%" cmd /k "!FRONTEND_CMD!"

echo OK. Backend e frontend iniciados em %HOST%:%PORT%.

goto :eof

:kill_port
set "KILL_PORT=%~1"
for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%KILL_PORT% " ^| findstr /R /C:"LISTENING"') do (
  echo [INFO] Matando PID %%A na porta %KILL_PORT%...
  taskkill /F /T /PID %%A >nul 2>&1
)
exit /b 0

:wait_port_free
set "CHECK_PORT=%~1"
set "CHECK_RETRIES=%~2"
:wait_loop
netstat -ano | findstr /R /C:":%CHECK_PORT% " | findstr /R /C:"LISTENING" >nul
if errorlevel 1 exit /b 0
if "!CHECK_RETRIES!" LEQ "0" exit /b 1
set /a CHECK_RETRIES-=1
timeout /t 1 /nobreak >nul
goto :wait_loop
