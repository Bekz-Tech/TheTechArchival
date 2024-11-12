import { Box, Button,useTheme } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Header from '../../components/Header'
import Admin from './admin';
// import Student from './student'
import Instructor from './instrcutor';
import { useSelector} from 'react-redux'; // Import Redux hooks


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
const user = useSelector((state) => state.users.user)

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
        <div onClick={() => {  navigate('dashbaord/messenger')}}>
        </div>

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