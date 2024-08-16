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
  mockCourseProgressData
} from '../../data/mockData';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import Pie from '../pie';

const StudentHomeDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [schedules, setSchedules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [resources, setResources] = useState([]);
  const [nextLecture, setNextLecture] = useState(null);
  const [messages, setMessages] = useState([]);

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

  return (
    <Box m="20px">
      {/* ROW 1 */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Next Lecture
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            {nextLecture ? (
              <Box textAlign="center">
                <SchoolIcon sx={{ fontSize: '50px', color: colors.greenAccent[500] }} />
                <Typography variant="h6">{nextLecture.subject}</Typography>
                <Typography>{nextLecture.date}</Typography>
                <Typography>{nextLecture.time}</Typography>
              </Box>
            ) : (
              <Typography>No upcoming lectures.</Typography>
            )}
          </Box>
        </Box>

        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Recommendations from Instructor
          </Typography>
          {recommendations.map((rec, i) => (
            <Box key={i} mb="10px">
              <Typography>{rec.text}</Typography>
            </Box>
          ))}
        </Box>

        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
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

        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Direct Messages
          </Typography>
          {messages.map((msg, i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={msg.picture} alt={msg.name} sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{msg.name}</Typography>
                  <Typography variant="body2">{msg.role}</Typography>
                  <Typography>{msg.text}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Attendance Level
          </Typography>
          <Pie data={mockAttendanceData} />
        </Box>

        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Course Progress
          </Typography>
          <Pie data={mockCourseProgressData} />
        </Box>

        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
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

        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
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
    </Box>
  );
};

export default StudentHomeDashboard;
