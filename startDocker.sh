#!/bin/bash

# Step 1: Build and start services defined in the docker-compose.yml in the root folder
echo "Building and starting services with docker-compose..."
docker-compose build
docker-compose up -d
echo "docker-compose services started."

# Step 2: Check for subfolders with Dockerfiles and build the services
for dir in */; do
  if [ -f "$dir/Dockerfile" ]; then
    echo "Found Dockerfile in $dir, building and starting service..."
    
    # Navigate to the subfolder and build the Docker image
    cd $dir
    docker build -t "${dir%/}" .
    docker run -d --name "${dir%/}" "${dir%/}"
    echo "Service for $dir started."
    
    # Return to the root directory
    cd ..
  fi
done

echo "All services have been built and started."
