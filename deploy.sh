#!/bin/bash

# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Copy index.html to 404.html for GitHub Pages
cp index.html 404.html

# Go back to the root directory
cd ..

# Switch to gh-pages branch
git checkout gh-pages

# Remove all files except .git and deploy.sh
git rm -r --cached .
git add dist/

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch
git push -f origin gh-pages

echo "Deployment complete!"