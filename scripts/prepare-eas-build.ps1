# Script para preparar o app para Expo build APK
# Este script configura os arquivos necessarios para build com EAS

$ErrorActionPreference = "Stop"

Write-Host "Iniciando preparacao para Expo build APK..." -ForegroundColor Green

# Caminhos dos arquivos
$projectRoot = Split-Path -Parent $PSScriptRoot
$appJsonPath = Join-Path $projectRoot "app.json"
$appConfigPath = Join-Path $projectRoot "app.config.js"
$easJsonPath = Join-Path $projectRoot "eas.json"

Write-Host "Diretorio do projeto: $projectRoot" -ForegroundColor Cyan

# Verificar se os arquivos existem
if (-not (Test-Path $appJsonPath)) {
    Write-Host "ERRO: app.json nao encontrado" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $appConfigPath)) {
    Write-Host "ERRO: app.config.js nao encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "Arquivos encontrados com sucesso" -ForegroundColor Green

# Passo 1: Configurar app.json
Write-Host "`nConfigurando app.json..." -ForegroundColor Yellow
$appJson = Get-Content $appJsonPath -Raw | ConvertFrom-Json

# Adicionar package name ao Android se nao existir
if (-not $appJson.expo.android.package) {
    $appJson.expo.android | Add-Member -NotePropertyName "package" -NotePropertyValue "com.ap_matheus.FlashConcurseiro"
    Write-Host "  Package name adicionado" -ForegroundColor Green
} else {
    Write-Host "  Package name ja existe" -ForegroundColor Green
}

# Remover EAS config de extra se existir
if ($appJson.extra.eas) {
    $appJson.extra.PSObject.Properties.Remove('eas')
    $appJson.extra.PSObject.Properties.Remove('router')
    Write-Host "  EAS config removido de extra" -ForegroundColor Green
}

# Adicionar EAS config ao nivel superior se nao existir
if (-not $appJson.expo.eas) {
    $appJson.expo | Add-Member -NotePropertyName "eas" -NotePropertyValue @{
        projectId = "c730163e-6511-4991-bf49-a447b8a36796"
    }
    Write-Host "  EAS config adicionado ao nivel superior" -ForegroundColor Green
} else {
    Write-Host "  EAS config ja existe no nivel superior" -ForegroundColor Green
}

# Salvar app.json
$appJson | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath
Write-Host "app.json configurado com sucesso" -ForegroundColor Green

# Passo 2: Configurar app.config.js
Write-Host "`nConfigurando app.config.js..." -ForegroundColor Yellow
$appConfigContent = Get-Content $appConfigPath -Raw

# Verificar se EAS config ja existe
if ($appConfigContent -match "eas:") {
    Write-Host "  EAS config ja existe em app.config.js" -ForegroundColor Green
} else {
    # Adicionar EAS config antes do fechamento do return
    $newEasConfig = @"

    eas: config.eas || {
      projectId: "c730163e-6511-4991-bf49-a447b8a36796",
    },"@
    
    $appConfigContent = $appConfigContent -replace '(    },\s*};)', "$newEasConfig`n    };"
    Set-Content $appConfigPath $appConfigContent
    Write-Host "  EAS config adicionado ao app.config.js" -ForegroundColor Green
}

Write-Host "app.config.js configurado com sucesso" -ForegroundColor Green

# Passo 3: Configurar eas.json
Write-Host "`nConfigurando eas.json..." -ForegroundColor Yellow

if (Test-Path $easJsonPath) {
    $easJson = Get-Content $easJsonPath -Raw | ConvertFrom-Json
} else {
    $easJson = @{
        cli = @{
            version = ">= 21.0.2"
            appVersionSource = "remote"
        }
        build = @{
            development = @{
                developmentClient = $true
                distribution = "internal"
            }
            preview = @{
                distribution = "internal"
            }
            production = @{
                autoIncrement = $true
            }
        }
        submit = @{
            production = @{}
        }
    }
}

# Adicionar buildType apk para Android
if ($easJson.build.preview.android) {
    $easJson.build.preview.android | Add-Member -NotePropertyName "buildType" -NotePropertyValue "apk" -Force
} else {
    $easJson.build.preview | Add-Member -NotePropertyName "android" -NotePropertyValue @{ buildType = "apk" }
}

if ($easJson.build.production.android) {
    $easJson.build.production.android | Add-Member -NotePropertyName "buildType" -NotePropertyValue "apk" -Force
} else {
    $easJson.build.production | Add-Member -NotePropertyName "android" -NotePropertyValue @{ buildType = "apk" }
}

# Salvar eas.json
$easJson | ConvertTo-Json -Depth 10 | Set-Content $easJsonPath
Write-Host "eas.json configurado com buildType: apk" -ForegroundColor Green

# Passo 4: Verificar configuracao
Write-Host "`nVerificando configuracao..." -ForegroundColor Yellow

$appJsonCheck = Get-Content $appJsonPath -Raw | ConvertFrom-Json
Write-Host "  Package name: $($appJsonCheck.expo.android.package)" -ForegroundColor Cyan
Write-Host "  EAS Project ID: $($appJsonCheck.expo.eas.projectId)" -ForegroundColor Cyan

Write-Host "`nConfiguracao concluida com sucesso!" -ForegroundColor Green
Write-Host "`nPara fazer o build, execute:" -ForegroundColor Yellow
Write-Host "   eas build --platform android --profile preview" -ForegroundColor White
Write-Host "   eas build --platform android --profile production" -ForegroundColor White
