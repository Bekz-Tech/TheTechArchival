// wsServer.js
const WebSocket = require('ws');
const { handleMessage, handleDisconnection } = require('./messageSignal');
const { handleVideoStream } = require('./videoSignal');
const { getAllUsers } = require('./dashboardData/adminsController/getAllUSers');

let clients = {};  // To store connected WebSocket clients

function websocketSignal(server) {
  const wss = new WebSocket.Server({ server });  // Attach WebSocket to the HTTP server

  wss.on('connection', (ws, req) => {
    console.log('A new client connected');

    // Fetch and send admin data on connection
    

    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      const { action } = data;

      // Handle messaging-related logic
      if (action === 'sendMessage') {
        await handleMessage(ws, data);
      };

      // Handle video streaming-related logic
      if (action === 'startStream' || action === 'endStream') {
        handleVideoStream(ws, data);
      };

      // Handle fetchAllUsers logic
      if (action === 'get users') {
        await getAllUsers(ws);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      handleDisconnection(ws);
    });
  });
}

module.exports = { websocketSignal };
