import React from "react";
import { Box, Typography, useTheme, LinearProgress } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const StudentProgress = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const topicsCovered = [
    "Introduction to Programming",
    "Data Structures",
    "Algorithms",
    "Object-Oriented Programming",
    "Database Management",
    // Add more topics as needed
  ];

  const weeks = 12; // Example total weeks for the course
  const completedWeeks = 8; // Example completed weeks

  const remainingTopics = [
    "Web Development",
    "Mobile App Development",
    "Cloud Computing",
    "Machine Learning",
    // Add more remaining topics as needed
  ];

  const completionPercentage = (completedWeeks / weeks) * 100;

  return (
    <Box m="20px">
      <Header title="Student Progress" subtitle="Track Your Learning Progress" />

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        backgroundColor={colors.primary[400]}
        p="20px"
        borderRadius="4px"
      >
        <Box gridColumn="span 12" mb="20px">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Progress Overview
          </Typography>
          <Typography variant="h6">Weeks Completed: {completedWeeks} / {weeks}</Typography>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{ height: "10px", borderRadius: "5px", mt: "10px", backgroundColor: colors.primary[300], "& .MuiLinearProgress-bar": { backgroundColor: colors.greenAccent[500] }}}
          />
          <Typography variant="h6" mt="10px">Completion Level: {completionPercentage.toFixed(2)}%</Typography>
        </Box>

        <Box gridColumn="span 6">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Topics Covered
          </Typography>
          {topicsCovered.map((topic, index) => (
            <Typography key={index} mb="10px">
              - {topic}
            </Typography>
          ))}
        </Box>

        <Box gridColumn="span 6">
          <Typography variant="h5" fontWeight="600" mb="15px">
            Remaining Topics to Cover
          </Typography>
          {remainingTopics.map((topic, index) => (
            <Typography key={index} mb="10px">
              - {topic}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentProgress;
