import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import { Box, InputBase, IconButton, useTheme, Badge, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsPopover from '../../components/notificationPopper';
import CodeGenerator from '../../../../generateCode/codeGenerator'; // Assuming this is a valid component

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  
  // Access notifications and unreadCount from Redux store
  const {unreadCount } = useSelector((state) => state.notifications);
  
  const userDetails = useSelector((state) => state.users.user);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [editDetails, setEditDetails] = useState(userDetails); // Initialize with userDetails from Redux

  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  const handleOpenProfile = () => setProfileOpen(true);
  const handleCloseProfile = () => setProfileOpen(false);

  const handleOpenNotifications = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    // Do not mark all notifications as read here
    // Simply open the notification popover
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
    // Save the details logic, you may want to dispatch an action to update the Redux store
    // dispatch(updateUserDetails(editDetails)); // Example of dispatching an action
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
        {(userDetails.role === "superadmin" || userDetails.role === "admin") && <CodeGenerator />}
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
        userId={userDetails.userId}  // Pass the userId from Redux state
        role={userDetails.role}      // Pass the user role from Redux state
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
            label="Name"
            name="name"
            value={editDetails.name || ''}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            label="Email"
            name="email"
            value={editDetails.email || ''}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDetails}>Save</Button>
          <Button onClick={handleCloseProfile}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;
