@echo off
cd /d c:\Users\vrajr\Desktop\Dipak-bhatt
git merge --abort > nul 2>&1
echo "Force pushing local main to remote..." > push_log.txt
git push --force origin main >> push_log.txt 2>&1
type push_log.txt
