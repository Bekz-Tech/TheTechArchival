import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LineChart from '../../components/LineChart';
import SchoolIcon from '@mui/icons-material/School';
import BarChart from '../../components/BarChart';
import StatBox from '../../components/StatBox';
import ProgressCircle from '../../components/ProgressCircle';
import { mockTransactions } from '../../data/mockData';
import { useState } from 'react';
import DataFetcher from './adminDataFetcher'; 

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [userData, setUserData] = useState([]);
  const [unreadEnquiriesCount, setUnreadEnquiriesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [timeTable, setTimeTable] = useState([]);

  // Function to check if a student is new (created in the last 24 hours)
  const isNewStudent = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    return createdDate >= oneDayAgo;
  };

  // Separate students and instructors
  const students = userData.filter(user => user.role === 'student');
  const instructors = userData.filter(user => user.role === 'instructor');
  const newStudents = students.filter(student => isNewStudent(student.createdAt));

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="140px"
      gap="20px"
    >
      {/* DataFetcher component to handle fetching data */}
      <DataFetcher 
        setUserData={setUserData}
        setUnreadEnquiriesCount={setUnreadEnquiriesCount}
        setTotalRevenue={setTotalRevenue}
        setTimeTable={setTimeTable}
      />

      {/* UI components */}
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          figure={students.length.toString()}
          subtitle="Students"
          icon={
            <GroupsIcon
              sx={{ color: colors.greenAccent[600], fontSize: "100%" }}
            />
          }
        />
      </Box>
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          figure={instructors.length.toString()}
          subtitle="Instructors"
          icon={
            <SchoolIcon
              sx={{ color: colors.greenAccent[600], fontSize: "100%" }}
            />
          }
        />
      </Box>
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          figure={newStudents.length.toString()}
          subtitle="New Students (past day)"
          icon={
            <PersonAddIcon
              sx={{ color: colors.greenAccent[600], fontSize: "100%" }}
            />
          }
        />
      </Box>
      <Box
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <StatBox
          figure={unreadEnquiriesCount.toString()}
          subtitle="Unread Enquiries"
          icon={
            <EmailIcon
              sx={{ color: colors.greenAccent[600], fontSize: "100%" }}
            />
          }
        />
      </Box>

      {/* ROW 2 */}
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <Box
          mt="25px"
          p="0 30px"
          display="flex "
          justifyContent="space-between"
          alignItems="center"
        >
          <Box p="10px 0">
            <Typography
              variant="h5"
              fontWeight="600"
              color={colors.grey[100]}
            >
              Revenue Generated
            </Typography>
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              ₦{totalRevenue.toFixed(2)}
            </Typography>
          </Box>
          <Box>
            <IconButton>
              <DownloadOutlinedIcon
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
              />
            </IconButton>
          </Box>
        </Box>
        <Box height="250px" m="-20px 0 0 0">
          <LineChart isDashboard={true} />
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        overflow="auto"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Class Schedules
          </Typography>
        </Box>

        {timeTable.map((schedule) => (
          <Box
            key={`${schedule.id}/${schedule.time}/${schedule.userId}`}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                {schedule.topic}
              </Typography>
              <Typography color={colors.grey[100]}>
                {`${schedule.firstName} ${schedule.lastName}`}
              </Typography>
            </Box>
            <Box color={colors.grey[100]}>{schedule.date}</Box>
            <Box
              backgroundColor={colors.greenAccent[500]}
              p="5px 10px"
              borderRadius="4px"
            >
              open
            </Box>
          </Box>
        ))}
      </Box>

      {/* ROW 3 */}
      <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        p="30px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight="600" pb="30px">
          Outstanding Payments
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt="25px"
          mb="25px"
        >
          <ProgressCircle size="125" />
          <Typography
            variant="h5"
            color={colors.greenAccent[500]}
            sx={{ pt: "20px" }}
          >
            ₦48,352 Oustanding payment
          </Typography>
          <Typography>20% of total expected payments</Typography>
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ padding: "30px 30px 0 30px" }}
        >
          Course registrations
        </Typography>
        <Box height="250px" mt="-20px">
          <BarChart isDashboard={true} />
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        overflow="auto"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          colors={colors.grey[100]}
          p="15px"
        >
          <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Payment Statistics
          </Typography>
        </Box>

        {mockTransactions.map((transaction, i) => (
          <Box
            key={`${transaction.txId}-${i}`}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Box>
              <Typography
                color={colors.greenAccent[500]}
                variant="h5"
                fontWeight="600"
              >
                {transaction.txId}
              </Typography>
              <Typography color={colors.grey[100]}>
                {transaction.user}
              </Typography>
            </Box>
            <Box color={colors.grey[100]}>{transaction.date}</Box>
            <Box
              backgroundColor={colors.greenAccent[500]}
              p="5px 10px"
              borderRadius="4px"
            >
              open
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Admin;
