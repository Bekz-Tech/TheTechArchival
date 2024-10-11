import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { getUserDetails } from "../utils/constants";

const useMessaging = (userId) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
      const userData = doc.data();
      if (userData) {
        setMessages(userData.messages || []);
        updateMessageDeliveredStatus(userData.messages);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Update delivered status for messages
  const updateMessageDeliveredStatus = async (messages) => {
    const updatedMessages = messages.map((msg) => {
      if (msg.receiver.senderId === userId && !msg.delivered) {
        return { ...msg, delivered: true };
      }
      return msg;
    });

    const hasUndeliveredMessages = updatedMessages.some(
      (msg, index) => msg.delivered && !messages[index].delivered
    );

    if (hasUndeliveredMessages) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { messages: updatedMessages });
    }
  };

  // Fetch the full details of the selected messenger
  const fetchMessengerDetails = async (messengerId) => {
    const userDoc = await getDoc(doc(db, 'users', messengerId));
    if (userDoc.exists()) {
      return { ...userDoc.data(), id: userDoc.id };
    } else {
      console.error(`User with ID ${messengerId} does not exist.`);
      return null;
    }
  };

  // When a messenger is selected, fetch their details and mark messages as read
  useEffect(() => {
    const updateMessagesAsRead = async () => {
      if (selectedMessenger && selectedMessenger.id) {
        const updatedMessages = messages.map((msg) => {
          if (msg.receiver.senderId === userId && msg.sender.senderId === selectedMessenger.id && !msg.read) {
            return { ...msg, read: true };
          }
          return msg;
        });

        const hasUnreadMessages = updatedMessages.some(
          (msg, index) => msg.read && !messages[index].read
        );

        if (hasUnreadMessages) {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, { messages: updatedMessages });
        }
      }
    };

    updateMessagesAsRead();
  }, [selectedMessenger, messages, userId]);

  // Set selected messenger and fetch their full details
  const handleMessengerClick = async (messengerId) => {
    const messengerDetails = await fetchMessengerDetails(messengerId);
    if (messengerDetails) {
      setSelectedMessenger(messengerDetails);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedMessenger) {
      const senderDoc = await getUserDetails();
      const message = {
        message: newMessage,
        isSentByUser: true,
        timestamp: new Date().toISOString(),
        delivered: false, // Initially false, updated later
        read: false,
        sender: {
          name: `${senderDoc.firstName} ${senderDoc.lastName}`,
          role: senderDoc.role,
          picture: senderDoc.profilePictureUrl,
          senderId: userId,
        },
        receiver: {
          name: `${selectedMessenger.firstName} ${selectedMessenger.lastName}`,
          role: selectedMessenger.role,
          picture: selectedMessenger.profilePictureUrl,
          senderId: selectedMessenger.id,
        },
      };

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        messages: [...messages, message],
      });

      const receiverRef = doc(db, 'users', selectedMessenger.id);
      await updateDoc(receiverRef, {
        messages: arrayUnion({
          ...message,
          isSentByUser: false,
        }),
      });

      setNewMessage('');
    }
  };

  return {
    messages,
    selectedMessenger,
    handleMessengerClick,
    newMessage,
    setNewMessage,
    handleSendMessage,
  };
};

export default useMessaging;
