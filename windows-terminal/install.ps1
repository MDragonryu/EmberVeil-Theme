$ErrorActionPreference = 'Stop'

$fragmentSource = Join-Path $PSScriptRoot 'themes\emberveil.json'
$fragmentRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows Terminal\Fragments\Emberveil'
$fragmentTarget = Join-Path $fragmentRoot 'emberveil.json'

if (-not (Test-Path -LiteralPath $fragmentSource)) {
    throw "Theme fragment not found: $fragmentSource"
}

New-Item -ItemType Directory -Path $fragmentRoot -Force | Out-Null
Copy-Item -LiteralPath $fragmentSource -Destination $fragmentTarget -Force

Write-Host "Installed Emberveil Windows Terminal schemes to: $fragmentTarget"
Write-Host 'Open Windows Terminal Settings, select a profile, and choose Emberveil Dark or Emberveil Light under Appearance > Color scheme.'
