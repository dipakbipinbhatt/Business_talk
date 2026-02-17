# Quick Server Git Fix

## Problem
Git repository on server has merge conflicts and cannot pull latest changes.

## Solution - Run these commands on your server:

```bash
# Step 1: Configure git user (required)
git config user.email "dipakbipinbhatt@gmail.com"
git config user.name "Dipak Bhatt"

# Step 2: Abort the rebase
git rebase --abort

# Step 3: Fetch and reset to remote (CAUTION: Discards local changes)
git fetch origin
git reset --hard origin/main

# Step 4: Clean up
git clean -fd

# Step 5: Verify
git status
git log --oneline -5
```

## After Git is Fixed

### Rebuild and Restart Containers:
```bash
# Stop containers
docker-compose down

# Rebuild with latest code
docker-compose up -d --build

# Check logs
docker-compose logs -f backend
```

## What This Does
1. **Configures git user**: Required for any git operations
2. **Aborts rebase**: Exits the current merge conflict state
3. **Resets to remote**: Makes your local code exactly match GitHub main branch
4. **Cleans up**: Removes any untracked files
5. **Verifies**: Shows you're now on latest commit

## Important Notes
- This will **discard any local changes** on the server
- All changes are already on GitHub main branch, so this is safe
- After this, your server will have the latest code including:
  - "PODCAST LIBRARY" navigation change
  - MongoDB connection stability fixes
  - Podcast sorting fixes
  - Calendar modal fixes

## If You Need to Keep Local Changes
If you have important local changes you want to keep:

```bash
# View what's in the stash
git stash list

# Apply stashed changes (after reset)
git stash pop
```

But typically for production servers, you want to match the remote exactly.
