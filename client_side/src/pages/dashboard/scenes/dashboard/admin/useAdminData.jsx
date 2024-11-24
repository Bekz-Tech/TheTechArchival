import { useDispatch, useSelector } from 'react-redux';
import useWebSocket from '../../../../../hooks/useWebocket';
import useApi from '../../../../../hooks/useApi';
import { setUsersData } from '../../../../../reduxStore/slices/adminDataSlice';
import { useEffect } from 'react';
import { setFetchedUsers, setFetchedCourses } from '../../../../../reduxStore/slices/apiCallCheck';
import { endpoints } from '../../../../../utils/constants';

const useAdminData = () => {
  const fetchedUsers = useSelector((state) => state.apiCallCheck.fetchedUsers);
  const dispatch = useDispatch();

  // Get the useApi hook results
  const { loading, data, error, callApi } = useApi(endpoints.GET_USERS);

  // Check for fetchedUsers and trigger API call if not fetched
  useEffect(() => {
    if (!fetchedUsers) {
      console.log('Fetching users from API...');
      callApi(); // Trigger the API call
    }
  }, [fetchedUsers, callApi]); // Trigger this effect when fetchedUsers changes or when callApi changes

  // When data changes (after API call resolves), dispatch it to Redux
  useEffect(() => {
    if (data) {
      console.log('Dispatching user data to Redux:', data);
      dispatch(setUsersData(data));  // Dispatch users data to Redux
      dispatch(setFetchedUsers());   // Set fetchedUsers to true
    }
  }, [data, dispatch]);  // This effect will trigger when 'data' or 'dispatch' changes

  // Define the action to trigger WebSocket server to fetch users
  const actionToSend = { action: 'watch users' };

  // Use the centralized useWebSocket hook, passing both URL and actionToSend
  useWebSocket(actionToSend);

  return { data, loading, error };
};

export default useAdminData;
