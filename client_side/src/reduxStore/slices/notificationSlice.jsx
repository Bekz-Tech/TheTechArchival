import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,  // New field to track unread notifications
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      // Recalculate unread count after setting notifications
      state.unreadCount = state.notifications.filter(notif => !notif.readStatus).length;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
      // If the notification is unread, increase the unread count
      if (!action.payload.readStatus) {
        state.unreadCount += 1;
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
      // Recalculate unread count after removing notification
      state.unreadCount = state.notifications.filter(notif => !notif.readStatus).length;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (notif) => notif.id === action.payload
      );
      if (notification && !notification.readStatus) {
        notification.readStatus = true;
        // Decrease unread count when a notification is marked as read
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      // Mark all notifications as read and reset unread count
      state.notifications.forEach((notif) => {
        notif.readStatus = true;
      });
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, removeNotification, markAsRead, markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;
