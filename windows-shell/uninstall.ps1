[CmdletBinding()]
param(
    [ValidateSet('Safe', 'Full')]
    [string]$Mode = 'Safe'
)

$ErrorActionPreference = 'Stop'
$userThemeDir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Themes'

$themeFiles = @(
    'Emberveil.theme',
    'Emberveil-Dark.theme'
)

if ($Mode -eq 'Full') {
    $themeFiles += @(
        'Emberveil-Full.theme',
        'Emberveil-Dark-Full.theme'
    )
}

foreach ($file in $themeFiles) {
    $path = Join-Path $userThemeDir $file
    if (Test-Path $path) {
        Remove-Item $path -Force
        Write-Host "Removed $path"
    }
}

if ($Mode -eq 'Full') {
    $systemThemeDir = Join-Path $env:windir 'Resources\Themes\Emberveil'
    if (Test-Path $systemThemeDir) {
        $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
        if (-not $isAdmin) {
            throw 'Removing Full-mode visual styles requires an elevated PowerShell session.'
        }
        Remove-Item $systemThemeDir -Recurse -Force
        Write-Host "Removed $systemThemeDir"
    }

    Write-Host 'SecureUxTheme was left untouched because it is an independent dependency.'
}

Write-Host 'Emberveil theme files removed. Windows personalization values were not forcibly reset; choose another Windows theme to restore your preferred colors/mode.'
