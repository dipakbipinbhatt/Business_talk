$logFile = "c:\Users\vrajr\Desktop\Dipak-bhatt\git_debug_log.txt"
Start-Transcript -Path $logFile -Force

Write-Output "--- Checking Git Location ---"
Get-Command git | Select-Object -ExpandProperty Source

Write-Output "--- Git Status Before ---"
git status

Write-Output "--- Adding Files ---"
git add .

Write-Output "--- Committing ---"
git commit -m "feat: updated stay updated section with dark maroon style and original logos"

Write-Output "--- Pushing ---"
git push

Write-Output "--- Git Status After ---"
git status

Stop-Transcript
