@echo off
setlocal enabledelayedexpansion

:: =====================================================================
:: KRYOS ASSET MIRROR - RECURSIVE EXTRACTION
:: Espelhamento total de pastas de imagens, fontes e estilos
:: =====================================================================

set "DEST_ROOT=KRYOS_ASSETS_PACK"

echo [*] Iniciando varredura profunda e espelhamento...

:: Limpa destino anterior para garantir copia limpa
if exist "%DEST_ROOT%" rd /s /q "%DEST_ROOT%"
mkdir "%DEST_ROOT%"

:: 1. Espelhamento de Imagens (Mantendo subpastas como /device, /top, etc)
echo [*] Espelhando pastas de imagens...
if exist "images" (
    robocopy "images" "%DEST_ROOT%\images" /E /MT:8 /R:3 /W:5 /NP
)

:: 2. Espelhamento de Fontes
echo [*] Espelhando pastas de fontes...
if exist "fonts" (
    robocopy "fonts" "%DEST_ROOT%\fonts" /E /MT:8 /R:3 /W:5 /NP
)

:: 3. Coleta de CSS e HTML (Varre subpastas caso existam)
echo [*] Coletando arquivos de estilo e estrutura...
robocopy "." "%DEST_ROOT%\css" *.css /S /XD %DEST_ROOT% /NP
robocopy "." "%DEST_ROOT%\html" *.html /S /XD %DEST_ROOT% /NP

:: 4. Ajuste de caminhos via PowerShell para o novo padrão de pastas
echo [*] Ajustando caminhos nos arquivos CSS para a nova estrutura...
powershell -Command "^
    $cssFiles = Get-ChildItem -Path '%DEST_ROOT%\css' -Filter *.css -Recurse; ^
    foreach ($file in $cssFiles) { ^
        $content = Get-Content $file.FullName; ^
        $content = $content -replace '\.\./fonts/', '/fonts/'; ^
        $content = $content -replace '\.\./images/', '/images/'; ^
        Set-Content $file.FullName $content; ^
        Write-Host '[Patch] ' $file.Name -ForegroundColor Yellow; ^
    } ^
"

echo.
echo =====================================================================
echo [SUCESSO] Espelhamento concluido.
echo A pasta '%DEST_ROOT%' reflete fielmente a estrutura original.
echo Mova as pastas de dentro dela para a pasta 'public' do seu novo App.
echo =====================================================================
pause