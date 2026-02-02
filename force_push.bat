@echo off
echo Setting remote URL to https://github.com/dipakbipinbhatt/Business_talk...
git remote remove origin
git remote add origin https://github.com/dipakbipinbhatt/Business_talk

echo Adding all files...
git add .

echo Committing changes...
git commit -m "feat: complete site update with dark maroon theme and original logos"

echo Ensuring branch is main...
git branch -M main

echo Pushing to remote...
git push -u origin main

echo Done.
