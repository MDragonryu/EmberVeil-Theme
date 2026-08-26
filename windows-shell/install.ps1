[CmdletBinding()]
param(
    [ValidateSet('Safe', 'Full')]
    [string]$Mode = 'Safe',

    [ValidateSet('Light', 'Dark')]
    [string]$Variant = 'Dark',

    [switch]$AccentTitleBars,
    [switch]$AccentShell,
    [switch]$CharcoalShell,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$themeName = if ($Variant -eq 'Dark') { 'Emberveil-Dark.theme' } else { 'Emberveil.theme' }
$safeTheme = Join-Path $root "safe\$themeName"
$userThemeDir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Themes'
$userTheme = Join-Path $userThemeDir $themeName

function Convert-HexToAbgrDword {
    param([Parameter(Mandatory)][string]$Hex, [byte]$Alpha = 0xFF)

    $value = $Hex.TrimStart('#')
    if ($value.Length -ne 6) { throw "Expected RRGGBB color, got '$Hex'." }

    $r = [Convert]::ToUInt32($value.Substring(0,2), 16)
    $g = [Convert]::ToUInt32($value.Substring(2,2), 16)
    $b = [Convert]::ToUInt32($value.Substring(4,2), 16)

    return [uint32](($Alpha -shl 24) -bor ($b -shl 16) -bor ($g -shl 8) -bor $r)
}

function Send-ThemeRefresh {
    if (-not ('Emberveil.NativeMethods' -as [type])) {
        Add-Type @'
using System;
using System.Runtime.InteropServices;
namespace Emberveil {
    public static class NativeMethods {
        [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        public static extern IntPtr SendMessageTimeout(
            IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam,
            uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
    }
}
'@
    }

    $HWND_BROADCAST = [IntPtr]0xffff
    $WM_SETTINGCHANGE = 0x001A
    $SMTO_ABORTIFHUNG = 0x0002
    $result = [UIntPtr]::Zero
    [void][Emberveil.NativeMethods]::SendMessageTimeout(
        $HWND_BROADCAST, $WM_SETTINGCHANGE, [UIntPtr]::Zero,
        'ImmersiveColorSet', $SMTO_ABORTIFHUNG, 3000, [ref]$result)
}

function Set-EmberveilPersonalization {
    param([ValidateSet('Light','Dark')][string]$SelectedVariant)

    $personalize = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize'
    $dwm = 'HKCU:\Software\Microsoft\Windows\DWM'
    $explorerAccent = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Accent'

    New-Item -Path $personalize -Force | Out-Null
    New-Item -Path $dwm -Force | Out-Null
    New-Item -Path $explorerAccent -Force | Out-Null

    $light = if ($SelectedVariant -eq 'Light') { 1 } else { 0 }
    Set-ItemProperty -Path $personalize -Name AppsUseLightTheme -Type DWord -Value $light
    Set-ItemProperty -Path $personalize -Name SystemUsesLightTheme -Type DWord -Value $light

    if ($SelectedVariant -eq 'Dark') {
        $accent = '#FF9F5B'
        $titleAccent = '#7B472B'
        $mutedShell = '#8E5F42'
        $charcoalShell = '#1D2029'
        $startModal = '#242632'

        $surface = if ($CharcoalShell) { $charcoalShell } else { $mutedShell }

        # AccentPalette slots are semantic, not a shade ramp.
        # Keep the first four slots orange so apps and interaction states can
        # continue to consume Emberveil's signature accent. Only the shell
        # surface slots are replaced by the selected taskbar/Start surface.
        $palette = @(
            '#FFB77E', # 0 app/action-center links + hover accents
            '#FF9F5B', # 1 task indicator / strong interaction accent
            '#D88752', # 2 Start hover
            '#FF9F5B', # 3 Settings/app accent brush
            $surface,  # 4 Start background / active taskbar surface
            $surface,  # 5 taskbar front / Start folder surface
            $surface,  # 6 taskbar background when transparency is active
            $surface   # 7 unused / defensive
        )
    }
    else {
        $accent = '#A44012'
        $titleAccent = '#84340F'
        $mutedShell = '#8A4D2E'
        $charcoalShell = '#CEC6BA'
        $startModal = '#E4DED2'

        $surface = if ($CharcoalShell) { $charcoalShell } else { $mutedShell }
        $palette = @(
            '#CE7850',
            '#A44012',
            '#BC5A2A',
            '#A44012',
            $surface,
            $surface,
            $surface,
            $surface
        )
    }

    $accentDword = Convert-HexToAbgrDword $accent
    $titleAccentDword = Convert-HexToAbgrDword $titleAccent
    $startModalDword = Convert-HexToAbgrDword $startModal
    $colorizationDword = Convert-HexToAbgrDword $titleAccent 0xC4

    # Keep the global/app accent on Emberveil orange. Modern applications such
    # as Task Manager can consume this independently of Explorer's shell
    # background slots below. ColorizationColor remains muted for broad chrome.
    Set-ItemProperty -Path $dwm -Name AccentColor -Type DWord -Value $accentDword
    Set-ItemProperty -Path $dwm -Name ColorizationColor -Type DWord -Value $colorizationDword
    Set-ItemProperty -Path $dwm -Name ColorPrevalence -Type DWord -Value ([int]$AccentTitleBars.IsPresent)

    [byte[]]$paletteBytes = foreach ($shade in $palette) {
        $value = $shade.TrimStart('#')
        [Convert]::ToByte($value.Substring(0,2), 16)
        [Convert]::ToByte($value.Substring(2,2), 16)
        [Convert]::ToByte($value.Substring(4,2), 16)
        [byte]0xFF
    }

    Set-ItemProperty -Path $explorerAccent -Name AccentPalette -Type Binary -Value $paletteBytes
    Set-ItemProperty -Path $explorerAccent -Name AccentColorMenu -Type DWord -Value $accentDword
    Set-ItemProperty -Path $explorerAccent -Name StartColorMenu -Type DWord -Value $startModalDword

    $showShellAccent = $AccentShell.IsPresent -or $CharcoalShell.IsPresent
    Set-ItemProperty -Path $personalize -Name ColorPrevalence -Type DWord -Value ([int]$showShellAccent)
    Set-ItemProperty -Path $personalize -Name AutoColorization -Type DWord -Value 0

    Send-ThemeRefresh
}

if (-not (Test-Path $safeTheme)) {
    throw "Missing safe theme payload: $safeTheme"
}

New-Item -ItemType Directory -Path $userThemeDir -Force | Out-Null
Copy-Item -Path $safeTheme -Destination $userTheme -Force

if ($Mode -eq 'Safe') {
    Set-EmberveilPersonalization -SelectedVariant $Variant

    Write-Host 'Installed Emberveil Windows Shell in SAFE mode.' -ForegroundColor Cyan
    Write-Host "Variant: $Variant"
    Write-Host 'Application/interaction accent: Emberveil signature orange'
    if ($CharcoalShell) {
        Write-Host 'Start/taskbar surface: Emberveil charcoal'
    }
    elseif ($AccentShell) {
        Write-Host 'Start/taskbar surface: muted ember-orange'
    }
    else {
        Write-Host 'Start/taskbar accent: disabled'
    }
    Write-Host "Accent on title bars/borders: $($AccentTitleBars.IsPresent)"
    Write-Host 'The .theme preset was installed but was NOT activated.'
    Write-Host 'Wallpaper, cursors, sounds and unsigned visual styles were not touched.'
    Write-Host 'Restart Explorer once after changing shell mode. Restart Task Manager too if it was already open.' -ForegroundColor DarkGray
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
        Write-Host 'Full installation cancelled. The Safe preset file remains installed but was not activated.'
        return
    }
}

$build = [Environment]::OSVersion.Version.Build.ToString()
$styleDir = Join-Path $root "full\styles\$build"
$styleFileName = if ($Variant -eq 'Dark') { 'Emberveil-Dark.msstyles' } else { 'Emberveil.msstyles' }
$styleSource = Join-Path $styleDir $styleFileName

if (-not (Test-Path $styleSource)) {
    throw "No Emberveil Full payload exists for Windows build $build. Expected: $styleSource`nNo unsupported visual style was applied."
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
Start-Sleep -Milliseconds 900
Set-EmberveilPersonalization -SelectedVariant $Variant
Write-Host "Installed Emberveil $Variant Full mode for Windows build $build." -ForegroundColor Green
Write-Host 'SecureUxTheme itself was not installed or modified by this script.'
