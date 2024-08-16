import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';

// Mock Data
const mockInstructorReviews = [
  { id: 1, studentName: 'Alice Johnson', rating: 4, review: 'Great instructor! Very knowledgeable and approachable.' },
  { id: 2, studentName: 'Bob Smith', rating: 5, review: 'Exceptional teaching skills. Made complex topics easy to understand.' },
  { id: 3, studentName: 'Charlie Brown', rating: 3, review: 'Good overall, but sometimes the explanations were a bit rushed.' },
  { id: 4, studentName: 'Diana Prince', rating: 4, review: 'Engaging classes with practical examples. Could improve on providing feedback.' },
  { id: 5, studentName: 'Edward Nygma', rating: 5, review: 'One of the best instructors I have had. Highly recommended!' },
];

const InstructorReviews = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="600" mb="20px" color={colors.greenAccent[500]}>
        Instructor Reviews
      </Typography>
      {mockInstructorReviews.map((review) => (
        <Box
          key={review.id}
          mb={2}
          p={2}
          borderRadius="8px"
          boxShadow={2}
          bgcolor={colors.primary[400]}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Typography variant="h6" color={colors.greenAccent[500]}>
            {review.studentName}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Rating: {review.rating} / 5
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {review.review}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default InstructorReviews;
