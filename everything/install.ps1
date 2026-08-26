param(
    [string]$ConfigPath
)

$ErrorActionPreference = 'Stop'

function Resolve-EverythingConfigPath {
    param([string]$ExplicitPath)

    if ($ExplicitPath) {
        return [System.IO.Path]::GetFullPath($ExplicitPath)
    }

    $candidates = @(
        (Join-Path $env:APPDATA 'Everything\Everything-1.5a.ini'),
        (Join-Path $env:APPDATA 'Everything\Everything.ini'),
        (Join-Path $env:LOCALAPPDATA 'Everything\Everything-1.5a.ini'),
        (Join-Path $env:LOCALAPPDATA 'Everything\Everything.ini')
    )

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) {
            return $candidate
        }
    }

    throw @"
Could not find an Everything 1.5 configuration file automatically.
Exit Everything, locate its active INI file, then run:
  .\install.ps1 -ConfigPath 'C:\path\to\Everything-1.5a.ini'
"@
}

function Read-ThemeFragment {
    param([string]$Path)

    $result = [ordered]@{}
    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith('#') -or $trimmed.StartsWith(';')) {
            continue
        }

        $parts = $trimmed.Split('=', 2)
        if ($parts.Count -ne 2) {
            throw "Invalid theme line in ${Path}: $line"
        }

        $result[$parts[0].Trim()] = $parts[1].Trim()
    }

    return $result
}

function Set-IniValues {
    param(
        [string[]]$Lines,
        [System.Collections.IDictionary]$Values
    )

    $remaining = [ordered]@{}
    foreach ($entry in $Values.GetEnumerator()) {
        $remaining[$entry.Key] = $entry.Value
    }

    $output = foreach ($line in $Lines) {
        if ($line -match '^\s*([^;#][^=]*)=(.*)$') {
            $key = $Matches[1].Trim()
            if ($remaining.Contains($key)) {
                "$key=$($remaining[$key])"
                $remaining.Remove($key)
                continue
            }
        }
        $line
    }

    if ($remaining.Count -gt 0) {
        $output += ''
        $output += '# Emberveil theme values'
        foreach ($entry in $remaining.GetEnumerator()) {
            $output += "$($entry.Key)=$($entry.Value)"
        }
    }

    return ,$output
}

if (Get-Process -Name 'Everything', 'Everything64' -ErrorAction SilentlyContinue) {
    throw 'Everything is still running. Exit it completely from File > Exit or the tray icon, then run the installer again.'
}

$config = Resolve-EverythingConfigPath -ExplicitPath $ConfigPath
if (-not (Test-Path -LiteralPath $config)) {
    throw "Everything configuration file not found: $config"
}

$themeDir = Join-Path $PSScriptRoot 'themes'
$lightPath = Join-Path $themeDir 'Emberveil Light.ini'
$darkPath = Join-Path $themeDir 'Emberveil Dark.ini'

foreach ($path in @($lightPath, $darkPath)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Theme fragment not found: $path"
    }
}

$light = Read-ThemeFragment -Path $lightPath
$dark = Read-ThemeFragment -Path $darkPath
$values = [ordered]@{}
foreach ($entry in $light.GetEnumerator()) { $values[$entry.Key] = $entry.Value }
foreach ($entry in $dark.GetEnumerator()) { $values[$entry.Key] = $entry.Value }

$lines = @(Get-Content -LiteralPath $config)
$backup = [ordered]@{
    configPath = $config
    createdAt = (Get-Date).ToString('o')
    values = [ordered]@{}
}

foreach ($key in $values.Keys) {
    $existing = $null
    $found = $false
    foreach ($line in $lines) {
        if ($line -match '^\s*([^;#][^=]*)=(.*)$' -and $Matches[1].Trim() -eq $key) {
            $existing = $Matches[2]
            $found = $true
            break
        }
    }

    $backup.values[$key] = [ordered]@{
        existed = $found
        value = $existing
    }
}

$stateDir = Join-Path $env:LOCALAPPDATA 'Emberveil\Everything'
New-Item -ItemType Directory -Path $stateDir -Force | Out-Null
$backupPath = Join-Path $stateDir 'pre-emberveil.json'
$backup | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $backupPath -Encoding UTF8

$updated = Set-IniValues -Lines $lines -Values $values
Set-Content -LiteralPath $config -Value $updated -Encoding UTF8

Write-Host "Installed Emberveil Light and Emberveil Dark into: $config"
Write-Host "Previous values saved to: $backupPath"
Write-Host 'Start Everything and choose Standard, Dark, or User default under View > Theme.'
