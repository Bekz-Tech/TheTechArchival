import React, { createContext, useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore'; // Import updateDoc to update Firestore document
import { db } from '../firebase/config'; // Firestore config
import useUserRegistration from '../hooks/useUserRegistration'; // Import the hook to fetch notifications

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { userNotifications } = useUserRegistration(); // Always call this hook

  // Helper function to filter out duplicate notifications based on 'id'
  const filterUniqueNotifications = (notifications) => {
    return notifications.filter((notification, index, self) => 
      index === self.findIndex((n) => n.id === notification.id)
    );
  };

  // useEffect to update notifications and unread count when userNotifications changes
  useEffect(() => {
    if (userNotifications && userNotifications.length > 0) {
      // Filter out duplicates before setting notifications
      const uniqueNotifications = filterUniqueNotifications(userNotifications);
      
      setNotifications(uniqueNotifications);

      const unread = uniqueNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    }
  }, [userNotifications]); // Depend on userNotifications to update when it changes

  // Mark a single notification as read
  const markNotificationAsRead = async (notificationId, userId) => {
    try {
      const notificationRef = doc(db, 'users', userId);
      const updatedNotifications = notifications.map((notification) => {
        if (notification.id === notificationId) {
          notification.read = true; // Update the notification status
        }
        return notification;
      });

      await updateDoc(notificationRef, { notifications: updatedNotifications });

      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async (userId) => {
    try {
      const notificationRef = doc(db, 'users', userId);
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true, // Set all notifications to read
      }));

      await updateDoc(notificationRef, { notifications: updatedNotifications });

      setNotifications(updatedNotifications);
      setUnreadCount(0); // All notifications are read, so unreadCount becomes 0
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markNotificationAsRead, 
      markAllNotificationsAsRead // Provide markAllNotificationsAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
