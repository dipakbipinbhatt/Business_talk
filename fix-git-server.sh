#!/bin/bash

echo "=== Fixing Git Repository on Server ==="
echo ""

# Configure git user
echo "1. Configuring git user..."
git config user.email "dipakbipinbhatt@gmail.com"
git config user.name "Dipak Bhatt"
echo "✅ Git user configured"
echo ""

# Abort any ongoing rebase
echo "2. Aborting any ongoing rebase..."
git rebase --abort 2>/dev/null || echo "No rebase in progress"
echo ""

# Show current status
echo "3. Current git status:"
git status
echo ""

# Fetch latest from remote
echo "4. Fetching latest from remote..."
git fetch origin
echo "✅ Fetched latest changes"
echo ""

# Reset to remote main (CAUTION: This discards local changes)
echo "5. Resetting to remote main branch..."
echo "⚠️  WARNING: This will discard all local changes!"
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git reset --hard origin/main
    echo "✅ Reset to origin/main"
else
    echo "❌ Aborted. Please resolve conflicts manually."
    exit 1
fi
echo ""

# Clean untracked files
echo "6. Cleaning untracked files..."
git clean -fd
echo "✅ Cleaned untracked files"
echo ""

# Verify status
echo "7. Final status:"
git status
echo ""

# Show latest commits
echo "8. Latest commits:"
git log --oneline -5
echo ""

echo "=== Git repository is now clean and up to date! ==="
echo ""
echo "Next steps:"
echo "1. Rebuild and restart containers: docker-compose down && docker-compose up -d --build"
echo "2. Check logs: docker-compose logs -f"
