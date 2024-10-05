import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { tokens } from '../theme';

// Mock data for demonstration
const mockMessages = [
  {
    name: 'Alice Johnson',
    role: 'Instructor',
    picture: '/path/to/alice.jpg',
    conversation: [
      { message: 'Hello, how can I assist you today?', isSentByUser: false },
      { message: 'I have a question about the assignment.', isSentByUser: true },
      { message: 'Sure! What do you need help with?', isSentByUser: false },
    ],
  },
  {
    name: 'Bob Smith',
    role: 'Instructor',
    picture: '/path/to/bob.jpg',
    conversation: [
      { message: 'Good afternoon! Ready for the lecture?', isSentByUser: false },
      { message: 'Yes, looking forward to it!', isSentByUser: true },
    ],
  },
];

const ChatComponent = ({ messages = mockMessages, selectedMessenger, handleMessengerClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex" backgroundColor={colors.primary[400]} height="100%">
      {/* Messenger List */}
      <Box
        width="30%"
        backgroundColor={colors.primary[500]} // Darker shade for distinction
        p="10px"
        overflow="auto"
        borderRight={`1px solid ${colors.grey[700]}`} // Border for separation
      >
        <Typography variant="h5" fontWeight="600" mb="10px" color="white">
          Messenges
        </Typography>
        {messages.map((msg, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="center"
            mb="15px"
            p="10px"
            sx={{
              cursor: 'pointer',
              backgroundColor: selectedMessenger?.name === msg.name ? colors.greenAccent[500] : 'inherit',
              borderRadius: '8px',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: colors.greenAccent[700], // Hover effect
              },
            }}
            onClick={() => handleMessengerClick(msg)}
          >
            <Avatar src={msg.picture} alt={msg.name} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6" color="white">{msg.name}</Typography>
              <Typography variant="body2" color={colors.grey[300]}>{msg.role}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Conversation Window */}
      <Box width="70%" p="20px" backgroundColor={colors.primary[400]}>
        {selectedMessenger ? (
          <Box>
            <Typography variant="h6" mb="10px" color="white">
              Conversation with {selectedMessenger.name}
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              gap="10px"
              height="calc(100% - 60px)"
              overflow="auto"
              paddingBottom="20px"
              borderTop={`1px solid ${colors.grey[700]}`} // Border for separation
            >
              {selectedMessenger.conversation.map((text, i) => (
                <Typography
                  key={i}
                  sx={{
                    color: text.isSentByUser ? colors.greenAccent[500] : 'white',
                    alignSelf: text.isSentByUser ? 'flex-end' : 'flex-start',
                    backgroundColor: text.isSentByUser ? colors.grey[800] : colors.grey[900],
                    borderRadius: '8px',
                    p: '10px',
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                  }}
                >
                  {text.message}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography color="white">Select a messenger to view the conversation</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatComponent;
