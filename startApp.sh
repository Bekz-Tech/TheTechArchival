#!/bin/bash

# Step 1: Open the folder containing the MongoDB data
echo "Starting MongoDB..."
mongod & # Start MongoDB in the background
sleep 5  # Give it a few seconds to initialize

# Step 2: Change directory to the client side and start the client
echo "Starting client..."
cd client_side || exit
npm run dev & # Start the client in the background
sleep 5  # Give the client some time to start

# Step 3: Go back to the root folder
cd .. || exit

# Step 4: Change directory to the server side and start the server
echo "Starting server..."
cd server_side || exit
npm start

echo "All processes have been started."
