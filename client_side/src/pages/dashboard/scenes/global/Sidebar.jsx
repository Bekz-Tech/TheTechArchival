import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from '@mui/icons-material/School';
import GradeIcon from '@mui/icons-material/Grade';
import FolderIcon from '@mui/icons-material/Folder';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import profileImg from "../../../../images/profile-placeholder.png";
import EmailIcon from '@mui/icons-material/Email';
import { logout } from "../../../../firebase/utils";
import { getUserDetails } from "../../../../utils/constants";
import { useNavigate } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const userDetails = getUserDetails(navigate);
    if (userDetails) {
      setUser(userDetails);
    }
  }, [navigate]);

  if (!user) {
    return null; // or a loading spinner, or some fallback UI
  }

  const profileImage = user.profilePictureUrl ?? profileImg;

  const adminMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "User Management", to: "/dashboard/userManagement", icon: <PeopleOutlinedIcon /> },
    { title: "Course Management", to: "/dashboard/courseManagement", icon: <ReceiptOutlinedIcon /> },
    { title: "Content Management", to: "/dashboard/contentManagement", icon: <AssignmentIcon /> },
    { title: "Financial Management", to: "/dashboard/fInancialManagement", icon: <ContactsOutlinedIcon /> },
    { title: "Team", to: "/dashboard/team", icon: <PersonOutlinedIcon /> },
    { title: "Analytics and Reporting", to: "s", icon: <MapOutlinedIcon /> },
    { title: "Growth & Innovation", to: "", icon: <TimelineOutlinedIcon /> },
    { title: "Contacts", to: "/dashboard/contacts", icon: <SettingsOutlinedIcon /> },
    { title: "Support", to: "/dashboard/support", icon: <SupportAgentIcon /> },
    { title: "Feedbacks", to: "/dashboard/feedbacks", icon: <FeedbackIcon /> },
    { title: "Enquiries", to: "/dashboard/enquiries", icon: <EmailIcon /> },

  ];

  const studentMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "Timetable", to: "/dashboard/timeTable", icon: <CalendarTodayIcon /> },
    { title: "Assignments", to: "/dashboard/assignment", icon: <AssignmentIcon /> },
    { title: "Learning Plan", to: "/dashboard/learningPlan", icon: <LibraryBooksIcon /> },
    { title: "Student Progress", to: "/dashboard/studentProgress", icon: <TimelineOutlinedIcon /> },
    { title: "Curriculum", to: "/dashboard/curriculum", icon: <FolderIcon /> },
    { title: "Payment History", to: "/dashboard/studentPayment", icon: <MapOutlinedIcon /> },
  ];

  const instructorMenuItems = [
    { title: "Dashboard", to: "/dashboard", icon: <HomeOutlinedIcon /> },
    { title: "Timetable", to: "/dashboard/timeTable", icon: <CalendarTodayIcon /> },
    { title: "Assignments", to: "/dashboard/assignment", icon: <AssignmentIcon /> },
    { title: "Learning Plan", to: "/dashboard/learningPlan", icon: <LibraryBooksIcon /> },
    { title: "Reviews", to: "/dashboard/instructorReviews", icon: <GradeIcon /> },
    { title: "Course Management", to: "/dashboard/courseManagement", icon: <SchoolIcon /> },
    { title: "Student Management", to: "/dashboard/studentManagement", icon: <PeopleOutlinedIcon /> },
  ];


  const getMenuItems = () => {
    switch (user?.role) {
      case "student":
        return studentMenuItems;
      case "instructor":
        return instructorMenuItems;
      default:
        return adminMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                    Babtech E-learning
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={profileImage}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  fontSize="medium"
                  sx={{ p: "10px 0 0 0" }}
                >
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"} paddingTop={"10%"}>
            {menuItems.map((item) => (
              <Item
                key={item.title}
                title={item.title}
                to={item.to}
                icon={item.icon}
                selected={selected}
                setSelected={setSelected}
              />
            ))}

            <br></br>
            <IconButton onClick={handleLogout}>
              <LogoutIcon />
              <Typography style={{ ml: 5 }}>Sign out</Typography>
            </IconButton>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
