import React, { useState, useContext, useEffect } from 'react';
import { Box, InputBase, IconButton, useTheme, Badge, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsPopover from '../../components/notificationPopper';
import { NotificationContext } from '../../../../contexts/notifications'; // Import the NotificationContext
import DownloadIdButton from '../../components/IdCards';
import useSessionStoarge from '../../../../hooks/useSessionStorage';
import CodeGenerator from '../../../../generateCode/codeGenerator';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { notifications, unreadCount, markNotificationAsRead } = useContext(NotificationContext); // Access notifications and unreadCount

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [editDetails, setEditDetails] = useState({});


    const userDetails = useSessionStoarge().memoizedUserDetails;


  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  const handleOpenProfile = () => setProfileOpen(true);
  const handleCloseProfile = () => setProfileOpen(false);

  const handleOpenNotifications = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    // Mark notifications as read when opening the popover
    notifications.forEach(notification => {
      if (!notification.isRead) { // Assuming isRead is a property of notification
        markNotificationAsRead(notification.id, userDetails.userId); // Call the function to mark notification as read

        console.log(notification.id)
      }
    });
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchorEl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveDetails = () => {
    setUserDetails(editDetails);
    localStorage.setItem('btech_user', JSON.stringify(editDetails));
    handleCloseProfile();
  };

  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const notificationsId = isNotificationsOpen ? 'simple-popover' : undefined;

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" justifyContent="space-between" p={2} alignItems='center'>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ pl: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        {/* pin generation button */}
        {(userDetails.role === "superadmin" ||
          userDetails.role === "admin") && <CodeGenerator />}
      </Box>

      {/* ICONS */}
      <Box
        display="flex"
        sx={{
          color:
            theme.palette.mode === "light"
              ? colors.grey[100]
              : colors.greenAccent[700],
        }}
      >
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleOpenNotifications}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={handleOpenSettings}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleOpenProfile}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* Notifications Popover */}
      <NotificationsPopover
        anchorEl={notificationsAnchorEl}
        handleClose={handleCloseNotifications}
        notifications={notifications} // Pass the notifications to the popover
      />

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onClose={handleCloseSettings}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Typography>Dashboard settings go here...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Profile Modal */}
      <Dialog open={profileOpen} onClose={handleCloseProfile}>
        <DialogTitle>Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            name="firstName"
            value={editDetails.firstName || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={editDetails.lastName || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editDetails.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={editDetails.phoneNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          {userDetails.role === "student" ||
          userDetails.role === "instructor" ? (
            <DownloadIdButton userId={userDetails.userId} />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile}>Cancel</Button>
          <Button
            onClick={handleSaveDetails}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
