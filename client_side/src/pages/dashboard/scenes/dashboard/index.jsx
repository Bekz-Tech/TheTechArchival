import { Box, Button,useTheme } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Header from '../../components/Header'
import { useState, useEffect } from 'react';
import Admin from './admin';
import Student from './student';
import Instructor from './instrcutor';
import { db } from '../../../../firebase/config';


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState("");


  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('btech_user'));
    setUser(currentUser);
  }, []);



  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={user.firstName} subtitle="Welcome to your Babtech virtual learning dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      {user.role === "admin" || user.role === "superadmin" ?
      <Admin user={user}/>
      :user.role === "student" ?
      <Student user={user}/>
      :user.role === "instructor" ?
        <Instructor user={user}/>
        :
      null
      }

        </Box>
  );
};

export default Dashboard;