#!/bin/bash

# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Copy index.html to 404.html for GitHub Pages
cp index.html 404.html

# Initialize a new Git repository
git init

# Add all files to the Git repository
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch
git push -f git@github.com:YOUR_USERNAME/bingo-app.git main:gh-pages

# Go back to the root directory
cd ..

echo "Deployment complete!"