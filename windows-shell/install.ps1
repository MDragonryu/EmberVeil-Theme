[CmdletBinding()]
param(
    [ValidateSet('Safe', 'Full')]
    [string]$Mode = 'Safe',

    [ValidateSet('Light', 'Dark')]
    [string]$Variant = 'Dark',

    [switch]$AccentTitleBars,
    [switch]$AccentShell,
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

    # Explorer/DWM accent DWORD values are stored as 0xAABBGGRR.
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
        $palette = @('#5C321E','#7B472B','#A45F3A','#D57D49','#FF9F5B','#FFB77E','#FFD0AA','#FFE6D2')
    }
    else {
        $accent = '#A44012'
        $palette = @('#522009','#6B2A0C','#84340F','#A44012','#BC5A2A','#CE7850','#DFA086','#ECC7B6')
    }

    $accentDword = Convert-HexToAbgrDword $accent
    $colorizationDword = Convert-HexToAbgrDword $accent 0xC4

    Set-ItemProperty -Path $dwm -Name AccentColor -Type DWord -Value $accentDword
    Set-ItemProperty -Path $dwm -Name ColorizationColor -Type DWord -Value $colorizationDword
    Set-ItemProperty -Path $dwm -Name ColorPrevalence -Type DWord -Value ([int]$AccentTitleBars.IsPresent)

    # AccentPalette itself is eight RGBA entries, unlike the DWORD values above.
    # Keep it explicitly flat for Windows PowerShell 5.1 compatibility.
    [byte[]]$paletteBytes = foreach ($shade in $palette) {
        $value = $shade.TrimStart('#')
        [Convert]::ToByte($value.Substring(0,2), 16) # R
        [Convert]::ToByte($value.Substring(2,2), 16) # G
        [Convert]::ToByte($value.Substring(4,2), 16) # B
        [byte]0xFF                                    # A
    }

    Set-ItemProperty -Path $explorerAccent -Name AccentPalette -Type Binary -Value $paletteBytes
    Set-ItemProperty -Path $explorerAccent -Name AccentColorMenu -Type DWord -Value $accentDword
    Set-ItemProperty -Path $explorerAccent -Name StartColorMenu -Type DWord -Value $accentDword

    Set-ItemProperty -Path $personalize -Name ColorPrevalence -Type DWord -Value ([int]$AccentShell.IsPresent)
    Set-ItemProperty -Path $personalize -Name AutoColorization -Type DWord -Value 0

    Send-ThemeRefresh
}

if (-not (Test-Path $safeTheme)) {
    throw "Missing safe theme payload: $safeTheme"
}

# Keep the preset available in the user's theme directory, but Safe mode does
# not activate the .theme file. Applying a theme container can overwrite the
# user's wallpaper and is rejected on some Windows 11 builds. Safe mode works
# directly through the supported personalization state instead.
New-Item -ItemType Directory -Path $userThemeDir -Force | Out-Null
Copy-Item -Path $safeTheme -Destination $userTheme -Force

if ($Mode -eq 'Safe') {
    Set-EmberveilPersonalization -SelectedVariant $Variant

    Write-Host 'Installed Emberveil Windows Shell in SAFE mode.' -ForegroundColor Cyan
    Write-Host "Variant: $Variant"
    Write-Host 'Accent: Emberveil system accent + generated Explorer accent palette'
    Write-Host "Accent on title bars/borders: $($AccentTitleBars.IsPresent)"
    Write-Host "Accent on Start/taskbar: $($AccentShell.IsPresent)"
    Write-Host 'The .theme preset was installed but was NOT activated.'
    Write-Host 'Wallpaper, cursors, sounds and unsigned visual styles were not touched.'
    Write-Host 'If the taskbar keeps a cached old color, restart Explorer or sign out/in once.' -ForegroundColor DarkGray
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
