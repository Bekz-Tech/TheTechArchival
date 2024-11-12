const WebSocket = require('ws');
const { getModelByRole } = require('../controller/onlinUsers/utils');

let clients = {};  // To store connected clients

// Exportable WebSocket function
function messageSignal(server) {
  const wss = new WebSocket.Server({ server });  // Attach WebSocket to the HTTP server

  // WebSocket server connection
  wss.on('connection', (ws, req) => {
    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      const { userId, role, action, content, recipientId } = data;  // Added action and recipientId

      try {
        // Use the role to get the correct model and fetch the user from the database
        const Model = getModelByRole(role);
        const user = await Model.findOne({ userId }); // Ensure to use findOne

        if (user) {
          // Store the WebSocket client based on the userId
          clients[userId] = ws;
          console.log(`User ${userId} with role ${role} connected`);

          // Handle the 'sendMessage' action
          if (action === 'sendMessage' && recipientId) {
            // Get the recipient's model based on the userId
            const recipient = await Model.findOne({ userId: recipientId }); // Ensure to use findOne

            if (recipient) {
              // Create the message object following the message schema format
              const timestamp = new Date().toISOString();
              const newMessage = {
                delivered: false,
                isSentByUser: true,
                message: content,
                read: false,
                receiver: { userId: recipient.userId, role: recipient.role },
                sender: { userId: user.userId, role: user.role },
                timestamp
              };

              // Add the message to the sender's and receiver's messages array
              user.messages.push(newMessage);
              recipient.messages.push(newMessage);

              // Save both sender's and receiver's updated message arrays
              await user.save();
              await recipient.save();

              // Send a confirmation to the sender
              ws.send(JSON.stringify({ action: 'sendMessage', status: 'success', message: 'Message sent successfully!' }));

              // Send the message to the recipient (via WebSocket)
              if (clients[recipientId]) {
                clients[recipientId].send(JSON.stringify({
                  action: 'newMessage',
                  message: 'You have a new message',
                  content: newMessage
                }));
              } else {
                console.log(`Recipient ${recipientId} not connected via WebSocket`);
              }

            } else {
              // Recipient not found
              ws.send(JSON.stringify({ action: 'sendMessage', status: 'error', message: 'Recipient not found!' }));
            }
          }
        } else {
          // If user is not found, send an error message and close the connection
          ws.send(JSON.stringify({ message: 'User not found!' }));
          ws.close(); // Close the connection if user doesn't exist
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({ action: 'error', message: 'Error processing your request' }));
        ws.close();
      }
    });

    // Handle WebSocket disconnection
    ws.on('close', () => {
      for (let userId in clients) {
        if (clients[userId] === ws) {
          // Remove the disconnected client from the map
          delete clients[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}

module.exports = { messageSignal };
