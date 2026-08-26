[CmdletBinding()]
param(
    [ValidateSet('Safe', 'Full')]
    [string]$Mode = 'Safe',

    [ValidateSet('Light', 'Dark')]
    [string]$Variant = 'Dark',

    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$themeName = if ($Variant -eq 'Dark') { 'Emberveil-Dark.theme' } else { 'Emberveil.theme' }
$safeTheme = Join-Path $root "safe\$themeName"
$userThemeDir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Themes'
$userTheme = Join-Path $userThemeDir $themeName

function Set-EmberveilPersonalization {
    param([ValidateSet('Light','Dark')][string]$SelectedVariant)

    $personalize = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize'
    $dwm = 'HKCU:\Software\Microsoft\Windows\DWM'

    New-Item -Path $personalize -Force | Out-Null
    New-Item -Path $dwm -Force | Out-Null

    $light = if ($SelectedVariant -eq 'Light') { 1 } else { 0 }
    Set-ItemProperty -Path $personalize -Name AppsUseLightTheme -Type DWord -Value $light
    Set-ItemProperty -Path $personalize -Name SystemUsesLightTheme -Type DWord -Value $light

    # Keep the Emberveil accent localized. Windows stores these values as ABGR DWORDs.
    if ($SelectedVariant -eq 'Dark') {
        Set-ItemProperty -Path $dwm -Name AccentColor -Type DWord -Value 0xFF5B9FFF
        Set-ItemProperty -Path $dwm -Name ColorizationColor -Type DWord -Value 0xC45B9FFF
    }
    else {
        Set-ItemProperty -Path $dwm -Name AccentColor -Type DWord -Value 0xFF1240A4
        Set-ItemProperty -Path $dwm -Name ColorizationColor -Type DWord -Value 0xC41240A4
    }

    # Emberveil deliberately avoids broad saturated title bars/taskbars.
    Set-ItemProperty -Path $dwm -Name ColorPrevalence -Type DWord -Value 0
}

if (-not (Test-Path $safeTheme)) {
    throw "Missing safe theme payload: $safeTheme"
}

New-Item -ItemType Directory -Path $userThemeDir -Force | Out-Null
Copy-Item -Path $safeTheme -Destination $userTheme -Force
Set-EmberveilPersonalization -SelectedVariant $Variant

if ($Mode -eq 'Safe') {
    Write-Host 'Installing Emberveil Windows Shell in SAFE mode.' -ForegroundColor Cyan
    Write-Host 'No unsigned visual style, theme-service patch, or system-file replacement will be used.'
    Start-Process $userTheme
    Write-Host "Installed and opened $themeName."
    return
}

Write-Warning @'
FULL MODE changes Windows visual styling beyond normal personalization.
It requires SecureUxTheme and a Windows-build-specific Emberveil .msstyles payload.
The package does not replace Windows system files, but major Windows updates may require a new payload.
Full mode is intentionally separate from Safe mode and must be requested explicitly.
'@

if (-not $Force) {
    $answer = Read-Host 'Type FULL to confirm that you want to continue'
    if ($answer -cne 'FULL') {
        Write-Host 'Full installation cancelled. Safe theme files remain installed.'
        return
    }
}

$build = [Environment]::OSVersion.Version.Build.ToString()
$styleDir = Join-Path $root "full\styles\$build"
$styleFileName = if ($Variant -eq 'Dark') { 'Emberveil-Dark.msstyles' } else { 'Emberveil.msstyles' }
$styleSource = Join-Path $styleDir $styleFileName

if (-not (Test-Path $styleSource)) {
    throw "No Emberveil Full payload exists for Windows build $build. Expected: $styleSource`nSafe mode is already installed; no unsupported visual style was applied."
}

$secureUxCandidates = @(
    "$env:ProgramFiles\SecureUxTheme",
    "$env:ProgramFiles\SecureUxTheme\ThemeTool.exe",
    "$env:windir\SecureUxTheme.dll"
)
if (-not ($secureUxCandidates | Where-Object { Test-Path $_ })) {
    throw 'SecureUxTheme was not detected. Install and configure it separately before using -Mode Full.'
}

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    throw 'Full mode must be run from an elevated PowerShell session because the visual style is installed under %WINDIR%\Resources\Themes.'
}

$systemThemeDir = Join-Path $env:windir 'Resources\Themes\Emberveil'
New-Item -ItemType Directory -Path $systemThemeDir -Force | Out-Null
Copy-Item -Path $styleSource -Destination (Join-Path $systemThemeDir $styleFileName) -Force

$fullTemplate = Get-Content -Raw $safeTheme
$systemStylePath = "%SystemRoot%\Resources\Themes\Emberveil\$styleFileName"
$fullThemeText = $fullTemplate -replace 'Path=%ResourceDir%\\Themes\\Aero\\Aero.msstyles', "Path=$systemStylePath"
$fullThemePath = Join-Path $userThemeDir ($themeName -replace '\.theme$', '-Full.theme')
Set-Content -Path $fullThemePath -Value $fullThemeText -Encoding Unicode

Start-Process $fullThemePath
Write-Host "Installed Emberveil $Variant Full mode for Windows build $build." -ForegroundColor Green
Write-Host 'SecureUxTheme itself was not installed or modified by this script.'
