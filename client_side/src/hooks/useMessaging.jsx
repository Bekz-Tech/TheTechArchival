import { useState, useEffect, useCallback } from 'react';
import useWebSocket from './useWebocket';


const useMessaging = (userId, role) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const [error, setError] = useState(null);

  useWebSocket('http://localhost:4000', "message")


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
  }, [newMessage, userId, role, selectedMessenger]);

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
