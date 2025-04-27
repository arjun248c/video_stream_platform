#!/bin/bash

# Simple deployment script for Vercel

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git first."
    exit 1
fi

# Check if the current directory is a git repository
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# Check if remote origin exists
if ! git remote | grep -q "origin"; then
    echo "Remote origin not found."
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin $repo_url
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo "Deployment preparation complete!"
echo "Now go to Vercel and import your GitHub repository."
echo "Don't forget to add your environment variables:"
echo "  - NEXT_PUBLIC_SUPABASE_URL"
echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
