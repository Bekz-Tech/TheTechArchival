#!/bin/bash

# Step 1: Stop services started with docker-compose
echo "Stopping services managed by docker-compose..."
docker-compose down
echo "docker-compose services stopped."

# Step 2: Stop containers from subfolders with Dockerfile
for dir in */; do
  if [ -f "$dir/Dockerfile" ]; then
    container_name="${dir%/}"
    
    # Check if the container is running and stop it
    if docker ps -q -f name=$container_name; then
      echo "Stopping container for service $container_name..."
      docker stop $container_name
      docker rm $container_name
      echo "Service $container_name stopped and removed."
    fi
  fi
done

echo "All services and containers have been stopped."
