const WebSocket = require('ws');
const { getModelByRole } = require('../controller/onlinUsers/utils');

let messageClients = new Map();  // For messaging clients
let videoClients = new Set();    // For video signaling clients

let videoClientIdCounter = 0; // Unique counter for video clients

function webSocketSignal(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      const { userId, role, action, content, recipientId, type } = data;

      // Log incoming message and type
      console.log(`Received message of type: ${type}`);

      // Handle regular messaging clients
      if (action === 'connect') {
        console.log(`User ${userId} with role ${role} connected for messaging`);

        messageClients.set(userId, ws);

        ws.on('close', () => {
          messageClients.delete(userId);
          console.log(`User ${userId} disconnected from messaging`);
        });
      }

      // Handle video clients (video signaling)
      if (action === 'connectVideoClient') {
        // Assign a unique client ID for video clients
        videoClientIdCounter += 1;
        const clientId = videoClientIdCounter;
        ws.clientId = clientId;

        // Add the client to the videoClients set
        videoClients.add(ws);
        console.log(`Client ID ${clientId} connected for video calls`);

        // Send the unique client ID to the client
        ws.send(JSON.stringify({ type: 'client-id', clientId }));
      }

      // Handle video signaling actions (SDP offers/answers, ICE candidates)
      if (type === 'create-offer' || type === 'accept-offer' || type === 'ice-candidate') {
        // Log when the server receives signaling information
        console.log(`Server received signaling message: ${type}`);
        console.log('Signaling data:', data);

        // Relay signaling information only to video clients
        videoClients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify({ ...data, from: ws.clientId }));
          }
        });
      }

      // Handle messaging action: send message to recipient
      if (action === 'sendMessage') {
        const recipientSocket = messageClients.get(recipientId);
        if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
          recipientSocket.send(JSON.stringify({
            type: 'message',
            from: userId,
            content,
            timestamp: new Date().toISOString()
          }));
        }
      }

    });

    // Handle client disconnection
    ws.on('close', () => {
      if (ws.clientId) {
        // Remove the client from the videoClients set if it's a video client
        videoClients.delete(ws);
        console.log(`Client ID ${ws.clientId} disconnected from video calls`);
      }

      // Remove from messageClients if necessary (not needed since it's handled in `connect`)
    });
  });
}

module.exports = { webSocketSignal };
