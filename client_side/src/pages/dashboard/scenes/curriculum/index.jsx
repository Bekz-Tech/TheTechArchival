import React from "react";
import { Box, Typography, useTheme, Divider } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Curriculum = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const curriculum = [
    {
      week: 1,
      topics: ["Introduction to Programming", "Setting up the Environment"],
    },
    {
      week: 2,
      topics: ["Basic Syntax and Variables", "Control Structures"],
    },
    {
      week: 3,
      topics: ["Functions", "Arrays and Lists"],
    },
    {
      week: 4,
      topics: ["Object-Oriented Programming", "Classes and Objects"],
    },
    {
      week: 5,
      topics: ["Inheritance", "Polymorphism"],
    },
    {
      week: 6,
      topics: ["Data Structures", "Linked Lists"],
    },
    {
      week: 7,
      topics: ["Stacks and Queues", "Recursion"],
    },
    {
      week: 8,
      topics: ["Searching Algorithms", "Sorting Algorithms"],
    },
    {
      week: 9,
      topics: ["Database Management", "SQL Basics"],
    },
    {
      week: 10,
      topics: ["Advanced SQL", "Database Design"],
    },
    {
      week: 11,
      topics: ["Web Development Basics", "HTML and CSS"],
    },
    {
      week: 12,
      topics: ["JavaScript and DOM Manipulation", "React Basics"],
    },
    // Add more weeks and topics as needed
  ];

  return (
    <Box m="20px">
      <Header title="Curriculum" subtitle="Complete Course Curriculum" />

      <Box backgroundColor={colors.primary[400]} p="20px" borderRadius="4px">
        {curriculum.map((weekData, index) => (
          <Box key={index} mb="20px">
            <Typography variant="h5" fontWeight="600" mb="15px">
              Week {weekData.week}
            </Typography>
            <Box ml="20px">
              {weekData.topics.map((topic, topicIndex) => (
                <Typography key={topicIndex} mb="10px">
                  - {topic}
                </Typography>
              ))}
            </Box>
            {index < curriculum.length - 1 && (
              <Divider sx={{ backgroundColor: colors.grey[800], mt: "20px" }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Curriculum;
