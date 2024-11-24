import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LineChart from '../../../components/LineChart';
import SchoolIcon from '@mui/icons-material/School';
import StatBox from '../../../components/StatBox';
import ProgressCircle from '../../../components/ProgressCircle';
import useAdminData from './useAdminData';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Loader from '../../../../../utils/loader';


const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

 // Loading state to manage the data fetching
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(0);
  const [instructors, setInstructors] = useState(0);



  
  
  
  // Fetching WebSocket data using custom hook
  

  const usersData = useSelector((state) => state.adminData.usersData);

  useAdminData(); // Fetch WebSocket data

  useEffect(() => {
    if (usersData) {
      setLoading(false);
      setInstructors(usersData.instructors?.length || 0);
      setStudents(usersData.students?.length || 0);
    }
  }, [usersData])

  // Handle loading state
  
  




  // // Separate students and instructors
  // const students = userData.filter(user => user.role === 'student');
  // const instructors = userData.filter(user => user.role === 'instructor');
  // const newStudents = students.filter(student => isNewStudent(student.createdAt));

  // // Fix the transformDataForBarChart function
  // const transformDataForBarChart = (students) => {
  //   const courseCounts = {};
  //   const years = new Set();
  
  //   students.forEach(student => {
  //     const program = student.program || "Unknown Program";
  //     if (!student.createdAt) {
  //       console.error("No createdAt field");
  //       return;
  //     }
  
  //     const date = new Date(student.createdAt);
  //     if (isNaN(date.getTime())) {
  //       console.warn(`Skipping student with invalid date: ${student.createdAt}`);
  //       return;
  //     }
  
  //     const year = date.getFullYear();
  //     years.add(year);
  
  //     if (!courseCounts[year]) {
  //       courseCounts[year] = {};
  //     }
  
  //     if (courseCounts[year][program]) {
  //       courseCounts[year][program] += 1;
  //     } else {
  //       courseCounts[year][program] = 1;
  //     }
  //   });
  
  //   const sortedYears = Array.from(years).sort((a, b) => a - b);
  
  //   const formattedData = sortedYears.map(year => {
  //     return {
  //       year,
  //       ...courseCounts[year] || {}
  //     };
  //   });
  
  //   return formattedData;
  // };

  // // Getting outstanding payments
  // const outstanding = () => {
  //   let totalExpectedPayment = 0;
  //   let totalOutstandingPayment = 0;

  //   const paymentDetails = students.map(student => {
  //     const courseAmount = (student.courses || []).reduce((total, course) => {
  //       const cost = parseFloat(course.cost) || 0;
  //       return total + cost;
  //     }, 0);

  //     let paidAmount = 0;
  //     if (Array.isArray(student.amountPaid)) {
  //       paidAmount = student.amountPaid.reduce((total, paid) => total + paid, 0);
  //     } else if (!isNaN(parseFloat(student.amountPaid))) {
  //       paidAmount = parseFloat(student.amountPaid);
  //     }

  //     const outstandingPayment = courseAmount - paidAmount;

  //     totalExpectedPayment += courseAmount;
  //     totalOutstandingPayment += outstandingPayment;

  //     return {
  //       studentName: student.firstName + ' ' + student.lastName || 'Unknown',
  //       courseAmount,
  //       paidAmount,
  //       outstandingPayment
  //     };
  //   });

  //   return {
  //     paymentDetails,
  //     totalExpectedPayment,
  //     totalOutstandingPayment
  //   };
  // };

  if (!usersData) {
    return <Loader />; // You can add a spinner or other UI if needed
  }else{

    return (
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* UI components */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            figure={students}
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
            figure={instructors}
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
            figure={usersData.studentsIn24Hrs}
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
            figure= "2"
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
                ₦0
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
  
          {/* {timeTable.map((schedule) => (
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
          ))} */}
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
            {(() => {
              // const { totalExpectedPayment, totalOutstandingPayment } = outstanding();
              // const percentageOutstanding = 
              //   totalExpectedPayment !== 0
              //     ? (totalOutstandingPayment / totalExpectedPayment) * 100
              //     : 0;
  
              return (
                <>
                  <ProgressCircle
                    size="125"
                    progress= "10"
                  />
                  <Typography
                    variant="h5"
                    color={colors.greenAccent[500]}
                    sx={{ pt: "20px" }}
                  >
                    ₦0 outstanding payment
                  </Typography>
                  <Typography>
                    0% of total expected payments
                  </Typography>
                </>
              );
            })()}
          </Box>
        </Box>
  
        {/* Course Registrations */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Course Registrations
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart 
              // data= '0'
              isDashboard={true}
            />
          </Box>
        </Box> */}
  
        {/* Payment Details */}
        {/* <Box
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
  
          {payments.map((payment, i) => (
            <Box
              key={`${payment.userId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '150px', // Adjust as needed
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {`${payment.firstName} ${payment.lastName}`}
                </Typography>
                <Typography color={colors.grey[100]} fontSize={10} textOverflow={'ellipsis'}>
                  {payment.userId}
                </Typography>
              </Box>
              <Box color={colors.grey[100]} fontSize={10}>{payment.createdAt}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ₦{payment.amountPaid.toLocaleString()}
              </Box>
            </Box>
          ))}
        </Box> */}
      </Box>
    );

  }

  
};

export default Admin;
