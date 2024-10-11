import React from 'react';
import { NotificationProvider } from './notifications';
// Import other providers as needed

export const GlobalContext = ({ children }) => {
  return (
       <NotificationProvider>
      {/* Add other providers here as needed */}
      {children}
    </NotificationProvider>
   
  );
};
