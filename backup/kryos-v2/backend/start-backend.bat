@echo off
setlocal enabledelayedexpansion

set "HOST=%KRYOS_HOST%"
set "PORT=%KRYOS_PORT%"
if "%HOST%"=="" set "HOST=127.0.0.1"
if "%PORT%"=="" set "PORT=4001"

set "PYTHON=python"
if exist ".venv\Scripts\python.exe" (
  set "PYTHON=.venv\Scripts\python.exe"
)

if not exist ".venv\Scripts\python.exe" (
  echo [INFO] Criando venv...
  %PYTHON% -m venv .venv
  if errorlevel 1 (
    echo [ERRO] Falha ao criar venv.
    pause
    exit /b 1
  )
  set "PYTHON=.venv\Scripts\python.exe"
)

if not exist ".venv\.kryos_installed" (
  echo [INFO] Instalando dependencias...
  "%PYTHON%" -m pip install -r requirements.txt
  if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias.
    pause
    exit /b 1
  )
  echo installed> .venv\.kryos_installed
)

echo Iniciando backend em %HOST%:%PORT%...
%PYTHON% -m uvicorn app.main:app --reload --host %HOST% --port %PORT%
