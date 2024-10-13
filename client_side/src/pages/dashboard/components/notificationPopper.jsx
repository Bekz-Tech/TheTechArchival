import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { NotificationContext } from '../../../contexts/notifications';
import { tokens } from '../theme'; // Adjust path according to your project structure

const NotificationsPopover = ({ anchorEl, handleClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); // Access colors based on current theme mode
  const { notifications, unreadCount, markAllNotificationsAsRead, markNotificationAsRead } = useContext(NotificationContext);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screens

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification); // Set the selected notification
    setDetailsOpen(true); // Open the details dialog
    markNotificationAsRead(notification.id); // Mark the notification as read
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false); // Close the details dialog
    setSelectedNotification(null); // Clear the selected notification
  };

  // Sort notifications: unread first, then by createdAt in descending order
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read === b.read) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.read - b.read;
  });

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            width: isSmallScreen ? '70vw' : '30vw', // Adjust width based on screen size
            backgroundColor: colors.grey[800],
            marginLeft: 0,
            marginRight: 0,
            boxShadow: 'none',
            height: "50vh",
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <Box p={2}>
          <Typography variant="h6" sx={{ color: colors.primary[100] }}>Notifications ({unreadCount})</Typography>
          {sortedNotifications.length === 0 && (
            <Typography sx={{ color: colors.grey[300] }}>No new notifications</Typography>
          )}
          {sortedNotifications.map((notification) => (
            <Box
              key={notification.id} // Use unique id as key
              p={1}
              mb={1}
              borderRadius="4px"
              bgcolor={notification.read ? colors.grey[600] : colors.grey[700]} // Differentiate read/unread
              boxShadow={1}
              sx={{ cursor: 'pointer', position: 'relative', ':hover': { backgroundColor: colors.primary[300] } }}
              onClick={() => handleNotificationClick(notification)}
            >
              {!notification.read && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '8px',
                    transform: 'translateY(-50%)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'blue',
                    borderRadius: '50%',
                  }}
                />
              )}
              <Typography variant="body2" sx={{ color: colors.primary[100], paddingLeft: '16px' }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.grey[400], paddingLeft: '16px' }}>
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))}
          <Button onClick={markAllNotificationsAsRead} variant="outlined" color="primary" fullWidth>
            Mark all as read
          </Button>
        </Box>
      </Popover>

      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.primary[100] }}>Notification Details</DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box>
              <Typography variant="h6" sx={{ color: colors.primary[100] }}>Details</Typography>
              <Typography sx={{ color: colors.primary[100] }}>{selectedNotification.message}</Typography>
              <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationsPopover;
