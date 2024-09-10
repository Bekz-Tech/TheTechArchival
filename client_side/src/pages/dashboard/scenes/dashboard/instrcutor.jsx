import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Card, CardContent, Avatar, Rating } from '@mui/material';
import { tokens } from '../../theme';
import {
  mockInstructorSchedules,
  mockInstructorAssignments,
  mockInstructorRecommendations,
  mockInstructorResources,
  mockInstructorNextLecture,
  mockInstructorMessages,
} from '../../data/mockData';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Add this import for the Calendar icon
import ProgressCircle from '../../components/ProgressCircle';

const Instructor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [schedules, setSchedules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [resources, setResources] = useState([]);
  const [nextLecture, setNextLecture] = useState(null);
  const [messages, setMessages] = useState([]);
  const [overallRating, setOverallRating] = useState(null);

  const mockInstructorOverallRating = 4.7;

  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      if (isMounted) {
        setSchedules(mockInstructorSchedules);
        setAssignments(mockInstructorAssignments);
        setRecommendations(mockInstructorRecommendations);
        setResources(mockInstructorResources);
        setNextLecture(mockInstructorNextLecture);
        setMessages(mockInstructorMessages);
        setOverallRating(mockInstructorOverallRating);
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
        {/* Course Progress */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600">
            Course Progress
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" />
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              50% completed
            </Typography>
            <Typography>20% of total expected payments</Typography>
          </Box>
        </Box>

        {/* Attendance */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600">
            Attendance
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" />
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              70% rate
            </Typography>
            <Typography>20% of total expected payments</Typography>
          </Box>
        </Box>

        {/* Next Lecture */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px">
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

        {/* Overall Rating */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Overall Rating
          </Typography>
          <Box textAlign="center">
            {overallRating !== null ? (
              <Box>
                <Rating value={overallRating} readOnly precision={0.1} />
                <Typography variant="h6">Rating: {overallRating}</Typography>
              </Box>
            ) : (
              <Typography>No ratings available.</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* ROW 2 */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mt="20px">
        {/* Direct Messages */}
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

        {/* Time-table */}
        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Time-table
          </Typography>
          {/* Add timetable content here */}
        </Box>
      </Box>

      {/* ROW 3 */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mt="20px">
        {/* Assignments */}
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

        {/* Learning Path */}
        <Box gridColumn="span 6" backgroundColor={colors.primary[400]} p="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Learning Path
          </Typography>
          {/* Add learning path content here */}
          {recommendations.map((rec, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{rec.title}</Typography>
                <Typography>{rec.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Instructor;