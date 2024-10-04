import React, { createContext, useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, where, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUserDetails } from '../utils/constants';

// Function to generate a unique ID
const generateUniqueId = (() => {
  const generatedIds = new Set();

  return () => {
    let id;
    do {
      id = 'id-' + Math.random().toString(36).substr(2, 9);
    } while (generatedIds.has(id));
    generatedIds.add(id);
    return id;
  };
})();

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const parsedUser = getUserDetails();
    const userRole = parsedUser?.role || null;
    const userId = parsedUser?.userId || null;

    if (!userRole || !userId) {
      console.error('User role or ID is not found or is null.');
      return; // Early return if userRole or userId is not found
    }

    // Ensure the userId is in the correct format
    if (userId.includes('/')) {
      console.error('User ID should not contain slashes:', userId);
      return;
    }

    const usersCollection = collection(db, 'users');

    // Ensure all users have a notifications field
    const ensureNotificationsField = async () => {
      const allUsersSnapshot = await getDocs(usersCollection);
      allUsersSnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        if (!userData.notifications) {
          await setDoc(doc(db, 'users', userDoc.id), { notifications: [] }, { merge: true });
          console.log(`Initialized notifications field for user ${userDoc.id}`);
        }
      });
    };

    ensureNotificationsField(); // Run the initialization on mount

    const handleNewUserNotification = async (userDoc) => {
      const newUser = userDoc.data();
      const { firstName, lastName, role } = newUser;
      const message = `New user registered: ${firstName} ${lastName} as ${role}`;

      const notificationId = generateUniqueId();
      const notification = {
        id: notificationId,
        message,
        read: false,
        userId: userDoc.id,
        createdAt: new Date().toISOString(),
      };

      try {
        const adminQuery = query(usersCollection, where('role', 'in', ['admin', 'superadmin']));
        const adminSnapshot = await getDocs(adminQuery);

        adminSnapshot.forEach(async (adminDoc) => {
          const adminData = adminDoc.data();
          const adminNotifications = adminData.notifications || [];
          const isDuplicate = adminNotifications.some(n =>
            n.message === notification.message ||
            n.createdAt === notification.createdAt
          );

          if (!isDuplicate) {
            adminNotifications.push(notification);
            await updateDoc(doc(db, 'users', adminDoc.id), { notifications: adminNotifications });
            console.log(`Updated notifications for admin ${adminDoc.id}`);
          } else {
            console.log(`Duplicate notification detected for admin ${adminDoc.id}`);
          }
        });
      } catch (error) {
        console.error('Error adding notification:', error);
      }
    };

    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added' || change.type === 'removed') {
          await handleNewUserNotification(change.doc);
        }
      });
    });

    // Listen for changes in the logged-in user's notifications
    const userDocRef = doc(db, 'users', userId);
    console.log('User Document Reference:', userDocRef.path); // Debugging line

    const unsubscribeNotifications = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userNotifications = userData.notifications || [];
        console.log('Fetched notifications:', userNotifications); // Debugging statement
        setNotifications(userNotifications);
        const unread = userNotifications.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      } else {
        console.error('User document does not exist.');
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeNotifications();
    };
  }, []);

  const markAllAsRead = async () => {
    const parsedUser = getUserDetails();
    const userId = parsedUser?.userId || null;

    if (!userId) {
      console.error('User ID is not found or is null.');
      return;
    }

    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const userNotifications = userData.notifications || [];

      const updatedNotifications = userNotifications.map(notification => ({
        ...notification,
        read: true,
      }));

      await updateDoc(userDocRef, { notifications: updatedNotifications });

      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    const parsedUser = getUserDetails();
    const userId = parsedUser?.userId || null;

    if (!userId) {
      console.error('User ID is not found or is null.');
      return;
    }

    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const userNotifications = userData.notifications || [];

      const updatedNotifications = userNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );

      await updateDoc(userDocRef, { notifications: updatedNotifications });

      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, markNotificationAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
