import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Card, CardContent, Avatar } from '@mui/material';
import { tokens } from '../../theme';
import {
  mockSchedules,
  mockAssignments,
  mockRecommendations,
  mockResources,
  mockNextLecture,
  mockMessages,
  mockAttendanceData,
  mockCourseProgressData,
  mockPaymentData,
} from '../../data/mockData';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import ProgressCircle from '../../components/ProgressCircle'; // Import ProgressCircle

const StudentHomeDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [schedules, setSchedules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [resources, setResources] = useState([]);
  const [nextLecture, setNextLecture] = useState(null);
  const [messages, setMessages] = useState([]);

  const [selectedMessenger, setSelectedMessenger] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      if (isMounted) {
        setSchedules(mockSchedules);
        setAssignments(mockAssignments);
        setRecommendations(mockRecommendations);
        setResources(mockResources);
        setNextLecture(mockNextLecture);
        setMessages(mockMessages);
      }
    }, 1000);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMessengerClick = (messenger) => {
    setSelectedMessenger(messenger);
  };

  return (
    <Box m="20px">
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        {/* FIRST ROW */}
        <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px">
          {/* Course Progress */}
          <Box display="flex" flexDirection="column" alignItems="center" gap="10px">
            <Box backgroundColor={colors.primary[400]} p="10px" borderRadius="8px" textAlign="center">
              <Typography variant="h6" fontWeight="600" mb="5px">
                Course Progress
              </Typography>
              <ProgressCircle size="125" progress={mockCourseProgressData[0].value / 100} />
            </Box>
          </Box>
          {/* Attendance Level */}
          <Box display="flex" flexDirection="column" alignItems="center" gap="10px">
            <Box backgroundColor={colors.primary[400]} p="10px" borderRadius="8px" textAlign="center">
              <Typography variant="h6" fontWeight="600" mb="5px">
                Attendance Level
              </Typography>
              <ProgressCircle size="125" progress={mockAttendanceData[0].value / 100} />
            </Box>
          </Box>
          {/* Payment Rate */}
          <Box display="flex" flexDirection="column" alignItems="center" gap="10px">
            <Box backgroundColor={colors.primary[400]} p="10px" borderRadius="8px" textAlign="center">
              <Typography variant="h6" fontWeight="600" mb="5px">
                Payment Rate
              </Typography>
              <ProgressCircle size="125" progress={mockPaymentData[0].value / 100} />
            </Box>
          </Box>
          {/* Next Lecture */}
          <Box display="flex" flexDirection="column" alignItems="center" gap="10px">
            <Box backgroundColor={colors.primary[400]} p="10px" borderRadius="8px">
              <Typography variant="h6" fontWeight="600" mb="5px" textAlign="center">
                Next Lecture
              </Typography>
              {nextLecture ? (
                <Box textAlign="center">
                  <SchoolIcon sx={{ fontSize: '30px', color: colors.greenAccent[500] }} />
                  <Typography variant="h6">{nextLecture.subject}</Typography>
                  <Typography>{nextLecture.date}</Typography>
                  <Typography>{nextLecture.time}</Typography>
                </Box>
              ) : (
                <Typography>No upcoming lectures.</Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* SECOND ROW */}
        <Box gridColumn="span 4" display="flex" flexDirection="column" gap="20px">
          {/* Upcoming Schedule */}
          <Box backgroundColor={colors.primary[400]} p="20px">
            <Typography variant="h5" fontWeight="600" mb="15px">
              Upcoming Schedule
            </Typography>
            {schedules.map((schedule, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{schedule.course}</Typography>
                  <Typography>{schedule.date}</Typography>
                  <Typography>{schedule.time}</Typography>
                  <Typography>Location: {schedule.location}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Box gridColumn="span 4" display="flex" flexDirection="column" gap="20px">
          {/* Assignments */}
          <Box backgroundColor={colors.primary[400]} p="20px">
            <Typography variant="h5" fontWeight="600" mb="15px">
              Assignments
            </Typography>
            {assignments.map((assignment, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <AssignmentIcon sx={{ fontSize: '30px', color: colors.greenAccent[500] }} />
                  <Typography variant="h6">{assignment.title}</Typography>
                  <Typography>{assignment.dueDate}</Typography>
                  <Typography>{assignment.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <Box gridColumn="span 4" display="flex" flexDirection="column" gap="20px">
          {/* Useful Resources */}
          <Box backgroundColor={colors.primary[400]} p="20px">
            <Typography variant="h5" fontWeight="600" mb="15px">
              Useful Resources
            </Typography>
            {resources.map((res, i) => (
              <Card key={i} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{res.title}</Typography>
                  <a href={res.link} target="_blank" rel="noopener noreferrer">
                    {res.link}
                  </a>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* THIRD ROW (MESSAGES) */}
        <Box gridColumn="span 12" display="flex" flexDirection="column" gap="20px">
          <Box display="flex" backgroundColor={colors.primary[400]} height="300px">
            {/* Messenger List */}
            <Box width="30%" backgroundColor={colors.primary[400]} p="10px" overflow="auto">
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  display="flex"
                  alignItems="center"
                  mb="15px"
                  p="10px"
                  sx={{ cursor: 'pointer', backgroundColor: selectedMessenger?.name === msg.name ? colors.greenAccent[500] : 'inherit' }}
                  onClick={() => handleMessengerClick(msg)}
                >
                  <Avatar src={msg.picture} alt={msg.name} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{msg.name}</Typography>
                    <Typography variant="body2">{msg.role}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Conversation Window */}
            <Box width="70%" p="20px" backgroundColor={colors.primary[400]}>
              {selectedMessenger ? (
                <Box>
                  <Typography variant="h6" mb="10px">
                    Conversation with {selectedMessenger.name}
                  </Typography>
                  <Box display="flex" flexDirection="column" gap="10px">
                    {selectedMessenger.conversation.map((text, i) => (
                      <Typography key={i} sx={{ color: text.isSentByUser ? colors.greenAccent[500] : 'white' }}>
                        {text.message}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography>Select a messenger to view the conversation</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentHomeDashboard;
