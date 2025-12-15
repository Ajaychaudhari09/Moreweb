# Git Commands Cheat Sheet

Here are the essential commands you need to manage your code on GitHub.

## 1. First Time Setup (New Repository)

If you haven't connected your local folder to GitHub yet:

```bash
# Initialize git in your folder
git init

# Add all files to staging
git add .

# Commit your changes
git commit -m "Initial commit"

# Rename branch to main (standard practice)
git branch -M main

# Link to your GitHub repository (Replace URL with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## 2. Daily Workflow (Pushing Changes)

When you have made changes and want to update GitHub:

```bash
# 1. Check which files modified
git status

# 2. Add all changes
git add .

# 3. Commit with a message describing what you did
git commit -m "Fixed styling bugs and improved responsiveness"

# 4. Push to GitHub
git push
```

## 3. Common Useful Commands

| Command | Description |
| :--- | :--- |
| `git status` | Shows which files have changed. |
| `git log` | Shows a list of recent commits. |
| `git pull` | Downloads the latest changes from GitHub (if you edited there). |
| `git checkout -b new-feature` | Creates and switches to a new branch called "new-feature". |
| `git checkout main` | Switches back to the main branch. |

## 4. Fixing "Remote Origin Already Exists"

If you see an error saying `remote origin already exists`, it means this folder is already linked. You can check the current link with:

```bash
git remote -v
```

If it's wrong, remove it and add the new one:

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```
