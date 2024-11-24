import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../reduxStore/slices/messageSlice';
import { setStreamStatus } from '../reduxStore/slices/videoCallSlice';
import { setUsersData } from '../reduxStore/slices/adminDataSlice';
import { setError, setLoading } from '../reduxStore/slices/uiSlice';
import { addNotification } from '../reduxStore/slices/notificationSlice';  // Import the notification action

const useWebSocket = (actionToSend = null) => {
  const dispatch = useDispatch();
  const socket = useRef(null);
  const isConnected = useSelector((state) => state.stream.isConnected);
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    if (socket.current) return;  // Prevent re-connection if already connected

    console.log('Attempting to connect to WebSocket');

    // Dispatch loading state when attempting to connect
    dispatch(setLoading(true));

    // Create WebSocket connection
    socket.current = new WebSocket('http://localhost:5000'); // Replace with your WebSocket server URL

    socket.current.onopen = () => {
      console.log('WebSocket Connected');
      
      socket.current.send(JSON.stringify({ userId: user.userId, role: user.role }));
      dispatch(setLoading(false)); // Dispatch loading false once connection is successful
      dispatch(setStreamStatus({ isConnected: true })); // Ensure connection state is updated

      // If there's an action passed to be sent, send it
      if (actionToSend) {
        console.log('Sending initial action:', actionToSend);
        socket.current.send(JSON.stringify(actionToSend));
      }
    };

    socket.current.onclose = () => {
      console.log('WebSocket Disconnected');
      dispatch(setStreamStatus({ isConnected: false })); // Update connection status
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      dispatch(setLoading(false)); // Stop loading on error
      dispatch(setError('WebSocket Error: Unable to connect')); // Set error in Redux
      dispatch(setStreamStatus({ isConnected: false })); // Ensure connection status is false
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { action, message, content, users, notification } = data;
      console.log(action);

      // Handle different actions from the WebSocket
      switch (action) {
        case 'sendMessage':
          if (message) {
            console.log('New message received:', message);
            dispatch(addMessage(message));
          }
          break;

        case 'newMessage':
          if (message && content) {
            console.log('New message received with content:', message, content);
            dispatch(addMessage({ message, content }));
          }
          break;

        case 'streamStarted':
        case 'streamEnded':
          console.log('Stream status updated:', action, message);
          dispatch(setStreamStatus({ action, message }));
          break;

        case 'updatedUsers':
          if (users) {
            console.log('Updating users:', users);
            dispatch(setUsersData(users));
            console.log(users);
          }
          break;

        case 'notification':
          if (notification) {
            console.log('New notification received:', notification);
            // Dispatch the notification to Redux
            dispatch(addNotification(notification));
          }
          break;

        default:
          console.log('Unknown action:', action);
          break;
      }
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [dispatch, actionToSend, user]);

  // Send message to WebSocket server
  const sendMessage = (data) => {
    if (socket.current && isConnected) {
      console.log('Sending message:', data);
      socket.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
      dispatch(setError('WebSocket is not connected'));
    }
  };

  // Send video stream signal
  const sendStreamSignal = (data) => {
    if (socket.current && isConnected) {
      console.log('Sending stream signal:', data);
      socket.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
      dispatch(setError('WebSocket is not connected'));
    }
  };

  return { sendMessage, sendStreamSignal, isConnected };
};

export default useWebSocket;
