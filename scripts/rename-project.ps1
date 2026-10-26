# Rename-Project script: safely renames sewedy-assessment-system-main to sewedy-assessment-system
param(
    [string]$ParentDir = "D:\Me\~School\Capstone",
    [string]$OldName = "sewedy-assessment-system-main",
    [string]$NewName = "sewedy-assessment-system"
)

$OldPath = Join-Path $ParentDir $OldName
$NewPath = Join-Path $ParentDir $NewName

if (-not (Test-Path -LiteralPath $OldPath)) {
    if (Test-Path -LiteralPath $NewPath) {
        Write-Host "Project directory is already named '$NewName'." -ForegroundColor Green
        exit 0
    }
    Write-Host "Source directory not found: $OldPath" -ForegroundColor Red
    exit 1
}

Write-Host "Attempting rename: $OldName -> $NewName..." -ForegroundColor Cyan

try {
    Rename-Item -LiteralPath $OldPath -NewName $NewName -Force -ErrorAction Stop
    Write-Host "Project folder successfully renamed to: $NewName" -ForegroundColor Green
} catch {
    Write-Host "Directory is currently in active use by the running editor session." -ForegroundColor Yellow
    Write-Host "`nTo finalize the rename:" -ForegroundColor Cyan
    Write-Host "1. Close the editor / terminal window." -ForegroundColor White
    Write-Host "2. Run this command in PowerShell:" -ForegroundColor White
    Write-Host "   Rename-Item -LiteralPath '$OldPath' -NewName '$NewName'" -ForegroundColor Yellow
    Write-Host "3. Reopen the folder '$NewPath' in your editor." -ForegroundColor White
}

