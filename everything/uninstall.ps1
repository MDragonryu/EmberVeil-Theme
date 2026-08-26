param(
    [string]$ConfigPath
)

$ErrorActionPreference = 'Stop'

if (Get-Process -Name 'Everything', 'Everything64' -ErrorAction SilentlyContinue) {
    throw 'Everything is still running. Exit it completely from File > Exit or the tray icon, then run the uninstaller again.'
}

$stateDir = Join-Path $env:LOCALAPPDATA 'Emberveil\Everything'
$backupPath = Join-Path $stateDir 'pre-emberveil.json'

if (-not (Test-Path -LiteralPath $backupPath)) {
    throw "No Emberveil backup was found at: $backupPath"
}

$backup = Get-Content -LiteralPath $backupPath -Raw | ConvertFrom-Json
$config = if ($ConfigPath) {
    [System.IO.Path]::GetFullPath($ConfigPath)
} else {
    [string]$backup.configPath
}

if (-not (Test-Path -LiteralPath $config)) {
    throw "Everything configuration file not found: $config"
}

$restore = @{}
foreach ($property in $backup.values.PSObject.Properties) {
    $restore[$property.Name] = $property.Value
}

$lines = @(Get-Content -LiteralPath $config)
$output = New-Object System.Collections.Generic.List[string]
$seen = @{}

foreach ($line in $lines) {
    if ($line -match '^\s*([^;#][^=]*)=(.*)$') {
        $key = $Matches[1].Trim()
        if ($restore.ContainsKey($key)) {
            $seen[$key] = $true
            $saved = $restore[$key]
            if ($saved.existed) {
                $output.Add("$key=$($saved.value)")
            }
            continue
        }
    }

    if ($line -eq '# Emberveil theme values') {
        continue
    }

    $output.Add($line)
}

foreach ($key in $restore.Keys) {
    if (-not $seen.ContainsKey($key) -and $restore[$key].existed) {
        $output.Add("$key=$($restore[$key].value)")
    }
}

Set-Content -LiteralPath $config -Value $output -Encoding UTF8
Remove-Item -LiteralPath $backupPath -Force

if ((Test-Path -LiteralPath $stateDir) -and -not (Get-ChildItem -LiteralPath $stateDir -Force | Select-Object -First 1)) {
    Remove-Item -LiteralPath $stateDir -Force
}

Write-Host "Restored the pre-Emberveil Everything appearance values in: $config"
