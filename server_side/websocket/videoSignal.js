const WebSocket = require('ws');

let wss;
const clients = new Set();
let clientIdCounter = 0; // Counter to generate unique client IDs

const videocallSignal = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    clientIdCounter += 1; // Increment the client ID counter
    const clientId = clientIdCounter; // Assign a unique ID to the new client
    console.log(`New WebSocket connection: Client ID ${clientId}`);
    clients.add(ws);

    // Send the client ID to the newly connected client
    ws.send(JSON.stringify({ type: 'client-id', clientId }));

    // Log the number of connected clients
    console.log(`Number of connected clients: ${clients.size}`);

    ws.on('message', (message) => {
      console.log(`Client ID ${clientId} sent message:`, message);
      const msg = JSON.parse(message);

      // Broadcast messages based on type
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
          if (msg.type === 'create-offer') {
            console.log(`Client ID ${clientId} has created an offer. Sending to other clients.`);
            // Include the ID of the client that created the offer
            client.send(JSON.stringify({ ...msg, from: clientId }));
          } else if (msg.type === 'accept-offer') {
            console.log(`Client ID ${clientId} has accepted an offer from Client ID ${msg.from}.`);
            // Send the acceptance message back to the offer creator
            clients.forEach((innerClient) => {
              if (innerClient.readyState === WebSocket.OPEN && innerClient !== ws) {
                innerClient.send(JSON.stringify({ ...msg, from: clientId }));
              }
            });
          } else if (msg.type === 'ice-candidate') {
            console.log(`ICE candidate from Client ID ${clientId}:`, msg.candidate);
            // Broadcast ice candidates
            client.send(JSON.stringify(msg));
          }
        }
      });
    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed: Client ID ${clientId}`);
      clients.delete(ws);
      console.log(`Number of connected clients: ${clients.size}`);
    });
  });
};

module.exports = { videocallSignal };
