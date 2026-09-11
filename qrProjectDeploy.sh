#!/bin/bash

# ==========================================
# CONFIGURATION
# ==========================================
# The absolute path to your cloned Git repository
REPO_DIR="$HOME/projects/QR_Project"

# The internal port your app listens to inside the Docker container
# (Change the second number if your app uses a different port like 80 or 8080)
CONTAINER_PORT="3000"
LOCAL_PORT="127.0.0.1:3000"
# ==========================================

# Navigate to the repository directory
cd "$REPO_DIR" || { echo "Failed to change directory to $REPO_DIR"; exit 1; }

# Fetch the latest metadata from the remote repository without merging
git fetch

# Get the commit hashes for the local branch and the remote tracking branch
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "Changes detected! Pulling the latest version..."
    git pull

    echo "Stopping and removing the existing 'qr_webapp' container..."
    docker rm -f qr_webapp 2>/dev/null || echo "No existing container found."

    echo "Removing the old 'qr_app' image..."
    docker rmi qr_app 2>/dev/null || echo "No existing image found."
    
    echo "Building new Docker image 'qr_app'..."
    docker build -t qr_app .

    echo "Starting the new 'qr_webapp' container..."
    # Binds the container exclusively to 127.0.0.1 on port 3000
    docker run -d --name qr_webapp -p $LOCAL_PORT:$CONTAINER_PORT qr_app

    echo "Deployment successful."
fi
