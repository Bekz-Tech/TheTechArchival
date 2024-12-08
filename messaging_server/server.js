// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 4000;

// Create an HTTP server to serve Express
const server = http.createServer(app);

// Initialize WebSocket server instance
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected!');

  // Handle messages received from clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  // Handle when a client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send a welcome message to the client when they connect
  ws.send(JSON.stringify({message : 'Welcome to the WebSocket server!'}));
});

// Set up a basic route
app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

// Start the HTTP server
server.listen(4000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
