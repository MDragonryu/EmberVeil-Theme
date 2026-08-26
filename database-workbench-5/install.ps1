$ErrorActionPreference = 'Stop'

$target = Join-Path $env:LOCALAPPDATA 'Database Workbench 5 Pro\Data'
$source = Join-Path $PSScriptRoot 'themes'
$files = @(
    'Emberveil Dark.col',
    'Emberveil Light.col'
)

if (-not (Test-Path $source)) {
    throw "Theme source directory not found: $source"
}

if (-not (Test-Path $target)) {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
}

foreach ($file in $files) {
    $sourceFile = Join-Path $source $file
    $targetFile = Join-Path $target $file

    if (-not (Test-Path $sourceFile)) {
        throw "Theme file not found: $sourceFile"
    }

    Copy-Item -LiteralPath $sourceFile -Destination $targetFile -Force
    Write-Host "Installed $file"
}

Write-Host "Emberveil themes installed to: $target"
Write-Host 'Restart Database Workbench 5 if it is currently running.'
