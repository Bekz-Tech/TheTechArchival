// contexts.js or your context file
import NotificationProvider from "./notifications"; // Your existing provider


export const GlobalContext = ({ children }) => {

  return (
    <NotificationProvider>
        {children}
    </NotificationProvider>
  );
};

