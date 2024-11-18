import { useSelector } from 'react-redux';
import useWebSocket from '../../../../../hooks/useWebocket'; // Ensure this path is correct

const useAdminData = (url) => {

  // Define the action to trigger WebSocket server to fetch users
  const actionToSend = { action: 'get users' };

  // Use the centralized useWebSocket hook, passing both URL and actionToSend
  useWebSocket(url, actionToSend);



  return null;
};

export default useAdminData;
