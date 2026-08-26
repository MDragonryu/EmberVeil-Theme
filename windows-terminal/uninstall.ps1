$ErrorActionPreference = 'Stop'

$fragmentRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows Terminal\Fragments\Emberveil'
$fragmentTarget = Join-Path $fragmentRoot 'emberveil.json'

if (Test-Path -LiteralPath $fragmentTarget) {
    Remove-Item -LiteralPath $fragmentTarget -Force
    Write-Host "Removed Emberveil Windows Terminal schemes from: $fragmentTarget"
} else {
    Write-Host 'Emberveil Windows Terminal schemes are not installed.'
}

if ((Test-Path -LiteralPath $fragmentRoot) -and -not (Get-ChildItem -LiteralPath $fragmentRoot -Force | Select-Object -First 1)) {
    Remove-Item -LiteralPath $fragmentRoot -Force
}

Write-Host 'If an open Windows Terminal window still lists the schemes, close all Terminal windows and start it again.'
