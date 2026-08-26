$ErrorActionPreference = 'Stop'

$target = Join-Path $env:LOCALAPPDATA 'Database Workbench 5 Pro\Data'
$files = @(
    'Emberveil Dark.ini',
    'Emberveil Light.ini'
)

foreach ($file in $files) {
    $targetFile = Join-Path $target $file

    if (Test-Path $targetFile) {
        Remove-Item -LiteralPath $targetFile -Force
        Write-Host "Removed $file"
    }
    else {
        Write-Host "Not present: $file"
    }
}

Write-Host 'Emberveil themes removed from Database Workbench 5.'
Write-Host 'Restart Database Workbench 5 if it is currently running.'
