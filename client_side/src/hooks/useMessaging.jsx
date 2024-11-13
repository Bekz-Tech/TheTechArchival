import { useState, useEffect, useCallback } from 'react';

const useMessaging = (userId, role) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const [error, setError] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080'); // Your WebSocket server URL
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      ws.send(JSON.stringify({ userId, role, action: 'connect' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      } else if (data.error) {
        setError(data.error);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('Connection error');
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [userId, role]);

  // Send message function
  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === '' || !selectedMessenger) return;
    const messageData = {
      userId,
      role,
      action: 'sendMessage',
      message: newMessage,
      recipientId: selectedMessenger.id,
    };
    socket.send(JSON.stringify(messageData));
    setNewMessage('');
  }, [newMessage, socket, userId, role, selectedMessenger]);

  // Handle selecting a messenger
  const handleMessengerClick = (senderId) => {
    const messenger = messages.find((msg) => msg.senderId === senderId);
    if (messenger) {
      setSelectedMessenger(messenger.sender);
    }
  };

  return {
    messages,
    selectedMessenger,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleMessengerClick,
    error,
  };
};

export default useMessaging;
