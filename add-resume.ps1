# Script to add resume PDF to Git and push to GitHub
# Make sure your PDF file is named: Pasala_Paul_Alex_Samuel_John_AI_Engineer.pdf
# and is in the same folder as this script

Write-Host "Checking for resume PDF..." -ForegroundColor Cyan

$resumeFile = "Pasala_Paul_Alex_Samuel_John_AI_Engineer.pdf"

if (Test-Path $resumeFile) {
    Write-Host "✓ Resume PDF found!" -ForegroundColor Green
    Write-Host "Adding to Git..." -ForegroundColor Cyan
    
    git add $resumeFile
    git commit -m "Add resume PDF"
    git push
    
    Write-Host "✓ Resume PDF added and pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "✗ Resume PDF not found!" -ForegroundColor Red
    Write-Host "Please make sure the file is named: $resumeFile" -ForegroundColor Yellow
    Write-Host "And is in the folder: $(Get-Location)" -ForegroundColor Yellow
}

