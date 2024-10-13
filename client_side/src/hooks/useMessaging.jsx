import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const useMessaging = (userId) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const auth = getAuth(); // Get the Firebase auth instance
  const isMountedRef = useRef(true);

  // Memoizing the document reference for the user's messages
  const messagingRef = useMemo(() => doc(db, 'users', userId), [userId]);

  useEffect(() => {
    isMountedRef.current = true; // Component is mounted

    const unsubscribe = onSnapshot(messagingRef, (doc) => {
      if (isMountedRef.current) {
        const userData = doc.data();
        if (userData) {
          const updatedMessages = userData.messages || [];
          setMessages((prevMessages) => {
            if (JSON.stringify(prevMessages) !== JSON.stringify(updatedMessages)) {
              return updatedMessages;
            }
            return prevMessages;
          });
        }
      }
    });

    return () => {
      isMountedRef.current = false; // Component is unmounted
      unsubscribe();
    };
  }, [messagingRef]);

  const fetchMessengerDetails = useCallback(async (messengerId) => {
    const messengerRef = doc(db, 'users', messengerId);
    const messengerSnap = await getDoc(messengerRef);
    if (messengerSnap.exists()) {
      return { id: messengerId, ...messengerSnap.data() };
    } else {
      console.error('No such document!');
      return null;
    }
  }, []); // No dependencies needed

  const markMessagesAsRead = useCallback(async (messageIds) => {
    const updatePromises = messageIds.map(async (id) => {
      const messageToUpdate = messages.find((msg) => msg.timestamp === id);
      if (messageToUpdate && !messageToUpdate.read) {
        const updatedMessage = { ...messageToUpdate, read: true };
        await updateMessageInFirestore(updatedMessage);
      }
    });

    await Promise.all(updatePromises);
    if (isMountedRef.current) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (messageIds.includes(msg.timestamp) ? { ...msg, read: true } : msg))
      );
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() && selectedMessenger) {
      const timestamp = new Date().toISOString();
      const message = {
        message: newMessage,
        isSentByUser: true,
        timestamp,
        delivered: true, // Assume it's delivered for the sender
        read: false,
        sender: { senderId: userId },
        receiver: { senderId: selectedMessenger.id },
      };

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { messages: arrayUnion(message) });

      // Check if the receiver is currently logged in
      const receiverAuth = auth.currentUser; // Get the current authenticated user
      const isReceiverLoggedIn = receiverAuth && receiverAuth.uid === selectedMessenger.id;

      const receiverRef = doc(db, 'users', selectedMessenger.id);
      await updateDoc(receiverRef, {
        messages: arrayUnion({ 
          ...message, 
          isSentByUser: false, 
          delivered: isReceiverLoggedIn, // Set delivered based on receiver's login status
        }),
      });

      // Clear the input field after sending the message
      setNewMessage(''); 
    }
  }, [newMessage, selectedMessenger, userId, auth]);

  const updateMessageInFirestore = useCallback(async (message) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { messages: arrayUnion(message) });
  }, [userId]);

  const handleMessengerClick = useCallback(async (messengerId) => {
    const messengerDetails = await fetchMessengerDetails(messengerId);
    
    if (messengerDetails) {
      setSelectedMessenger(messengerDetails);

      const messageIdsToMarkAsRead = messages
        .filter((msg) => msg.receiver.senderId === userId && msg.sender.senderId === messengerId && !msg.read)
        .map((msg) => msg.timestamp);

      // Only mark messages as read if there are any unread messages
      if (messageIdsToMarkAsRead.length > 0) {
        await markMessagesAsRead(messageIdsToMarkAsRead);
      }
    }
  }, [userId, markMessagesAsRead]); // Removed `fetchMessengerDetails` from dependencies since it's defined above

  return {
    messages,
    selectedMessenger,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleMessengerClick,
    markMessagesAsRead,
  };
};

export default useMessaging;
