// import React, { useState, useEffect } from 'react';
// import { Box, Typography, useTheme, Card, CardContent, Avatar } from '@mui/material';
// import { tokens } from '../../../theme';
// import {
//   mockSchedules,
//   mockAssignments,
//   mockRecommendations,
//   mockResources,
//   mockNextLecture,

// } from '../../../data/mockData';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import SchoolIcon from '@mui/icons-material/School';
// import ProgressCircle from '../../../components/ProgressCircle';
// import ChatComponent from '../../../components/chatComponent';
// import useStudentData from './useStudentData';

// const Student = ({user}) => {
//   console.log(user.assignedInstructor.lastName)
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const [assignments, setAssignments] = useState([]);
//   const [resources, setResources] = useState([]);
//   const [selectedMessenger, setSelectedMessenger] = useState(null);
//   const { progressPercentage, attendanceRate, outstandings, nextClass, timeTable } = useStudentData();
  
  

//   useEffect(() => {
//     let isMounted = true;
//     setTimeout(() => {
//       if (isMounted) {
//         setAssignments(mockAssignments);
//         setResources(mockResources);
//       }
//     }, 1000);


//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const handleMessengerClick = (messenger) => {
//     setSelectedMessenger(messenger);
//   };

//   const progressData = [
//     { title: 'Course Progress', value: progressPercentage, details: 'Current course completion' },
//     { title: 'Attendance Level', value: attendanceRate, details: 'Attendance percentage' },
//   ];

//   return (
//     <Box m="20px">
//       <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
//         {/* FIRST ROW */}
//         <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px">
//           {progressData.map((progress, index) => (
//             <Box key={index}
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             gap="10px">
//               <Box
//                 backgroundColor={colors.primary[400]}
//                 p="10px"
//                 borderRadius="8px"
//                 textAlign="center"
//                 width="100%"
//                 height="100%"
//               >
//                 <Typography variant="h6" fontWeight="600" mb="5px">
//                   {progress.title}
//                 </Typography>
//                 <ProgressCircle size="125" progress={progress.value} />
//                 <Typography variant="body2" mt="10px">
//                   {progress.details}: {progress.value}%
//                 </Typography>
//               </Box>
//             </Box>
//           ))}

//           <Box
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             gap="10px">
//               <Box
//                 backgroundColor={colors.primary[400]}
//                 p="10px"
//                 borderRadius="8px"
//                 textAlign="center"
//                 width="100%"
//                 height="100%"
//               >
//                 <Typography variant="h6" fontWeight="600" mb="5px">
//                   Payment Rate ({parseInt(100 - outstandings.percentageDifference)}%)
//                 </Typography>
//                 <ProgressCircle size="125" progress={parseInt(100 - outstandings.percentageDifference)} />
//                 <Typography variant="body2" mt="10px">
//                   Oustanding Payments: {outstandings.totalOutstanding}
//                 </Typography>
//               </Box>
//             </Box>

//           {/* Next Lecture */}
//           <Box display="flex" flexDirection="column" alignItems="center" gap="10px">
//             <Box
//               backgroundColor={colors.primary[400]}
//               p="10px"
//               borderRadius="8px"
//               width="100%"
//               height="100%"
//             >
//               <Typography variant="h6" fontWeight="600" mb="5px" textAlign="center">
//                 Next Class
//               </Typography>
//               {nextClass ? (
//                 <Box textAlign="center">
//                   <SchoolIcon sx={{ fontSize: '30px', color: colors.greenAccent[500] }} />
//                   <Typography variant="h6">{nextClass.topic}</Typography> {/* Use nextClass.topic */}
//                   <Typography>{nextClass.date}</Typography> {/* Use nextClass.date */}
//                   <Typography>{nextClass.time}</Typography> {/* Use nextClass.time */}
//                   <Typography>Location: {nextClass.location}</Typography> {/* Use nextClass.location */}
//                 </Box>
//               ) : (
//                 <Typography>No upcoming lectures.</Typography>
//               )}
//             </Box>
//           </Box>
//         </Box>

//         {/* SECOND ROW */}
//         <Box gridColumn="span 12" display="flex" gap="20px" sx={{ height: '350px' }}>
//       {/* Upcoming Schedule */}
//       <Box
//       flex={1}
//       backgroundColor={colors.primary[400]}
//       p="20px"
//       sx={{ overflowY: 'auto' }}
//     >
//       <Typography variant="h5" fontWeight="600" mb="15px">
//         Upcoming Schedule
//       </Typography>
//       {timeTable
//         .filter((schedule) => {
//           const scheduleDateTime = new Date(`${schedule.date}T${schedule.time}`);
//           return scheduleDateTime > new Date(); // Only include upcoming schedules
//         })
//         .sort((a, b) => {
//           const dateA = new Date(`${a.date}T${a.time}`);
//           const dateB = new Date(`${b.date}T${b.time}`);
//           return dateA - dateB; // Sort by date and time
//         })
//         .map((schedule, index) => (
//           <Card key={schedule.id} sx={{ mb: 2 }}>
//             <CardContent>
//               <Typography variant="h6">{schedule.topic}</Typography>
//               <Typography>{schedule.date}</Typography>
//               <Typography>{schedule.time}</Typography>
//               <Typography>Location: {schedule.location}</Typography>
//             </CardContent>
//           </Card>
//         ))}
//     </Box>


//           {/* Assignments */}
//           <Box
//             flex={1}
//             backgroundColor={colors.primary[400]}
//             p="20px"
//             sx={{ overflowY: 'auto' }}
//           >
//             <Typography variant="h5" fontWeight="600" mb="15px">
//               Assignments
//             </Typography>
//             {assignments.map((assignment, index) => (
//               <Card key={index} sx={{ mb: 2 }}>
//                 <CardContent>
//                   <AssignmentIcon sx={{ fontSize: '30px', color: colors.greenAccent[500] }} />
//                   <Typography variant="h6">{assignment.title}</Typography>
//                   <Typography>{assignment.dueDate}</Typography>
//                   <Typography>{assignment.description}</Typography>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>

//           {/* Useful Resources */}
//           <Box
//             flex={1}
//             backgroundColor={colors.primary[400]}
//             p="20px"
//             sx={{ overflowY: 'auto' }}
//           >
//             <Typography variant="h5" fontWeight="600" mb="15px">
//               Useful Resources
//             </Typography>
//             {resources.map((res, i) => (
//               <Card key={i} sx={{ mb: 2 }}>
//                 <CardContent>
//                   <Typography variant="h6">{res.title}</Typography>
//                   <a href={res.link} target="_blank" rel="noopener noreferrer">
//                     {res.link}
//                   </a>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>
//         </Box>

//         {/* THIRD ROW (MESSAGES + INSTRUCTOR PROFILE) */}
//         <Box gridColumn="span 12" display="flex" gap="20px" sx={{ height: '300px' }}>
//           {/* Instructor Profile (1/3 width) */}
//           <Box
//             width="30%"
//             backgroundColor={colors.primary[400]}
//             p="20px"
            
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             justifyContent="center"
//             sx={{ borderRadius: '8px' }}
//           >
//             <Avatar
//               src="/path/to/instructor-profile-picture.jpg"
//               alt="Instructor Name"
//               sx={{ width: 120, height: 120, mb: 2 }}
//             />
//             <Typography variant="h6" fontWeight="600">
//              {user.assignedInstructor.firstName} {user.assignedInstructor.lastName}
//             </Typography>
            
//             <Typography variant="body2" color={colors.grey[500]}>
//             {user.assignedInstructor.email}
//             </Typography>
//             <Typography variant="body2" color={colors.grey[500]} mt="5px">
//               Office Hours: Mon - Fri, 10am - 2pm
//             </Typography>
//           </Box>

//                {/* Messages (2/3 width) */}
//                <Box width="70%">
//             {user && user.userId ? (
//               <ChatComponent loggedInUserId={user.userId} />
//             ) : (
//               <Typography>No user data available for chat.</Typography>
//             )}
//           </Box>

//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Student;
