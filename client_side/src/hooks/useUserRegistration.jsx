import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import useSessionStorage from './useSessionStorage';

const useUserRegistration = () => {
  const [userNotifications, setUserNotifications] = useState([]);
  const { memoizedUserDetails } = useSessionStorage();
  const userId = memoizedUserDetails?.userId || null;

  // Define the fetch function using useCallback to prevent it from being redefined on every render
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      console.error('User ID not found or is null.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const notifications = userData.notifications || [];
        setUserNotifications(notifications);
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userId]); // Ensure userId is added to the dependency array

  // useEffect will only run when userId changes
  useEffect(() => {
    fetchNotifications(); // Call the fetchNotifications function
  }, [fetchNotifications]); // Ensure useEffect depends on the memoized function

  return { userNotifications }; // Return the notifications fetched
};

export default useUserRegistration;
