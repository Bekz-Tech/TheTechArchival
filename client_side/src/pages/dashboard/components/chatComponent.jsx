import React, { useEffect } from 'react';
import { Box, Typography, Avatar, TextField, Button, useTheme } from '@mui/material';
import { tokens } from '../theme';
import useMessaging from '../../../hooks/useMessaging';

const ChatComponent = ({ loggedInUserId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    messages,
    selectedMessenger,
    handleMessengerClick,
    newMessage,
    setNewMessage,
    handleSendMessage,
    markMessagesAsRead,
  } = useMessaging(loggedInUserId); // Pass auth to the hook

  console.log(messages)

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
    return `${date.toLocaleDateString(undefined, optionsDate)} ${date.toLocaleTimeString([], optionsTime).replace(':00', '').toLowerCase()}`;
  };

  const uniqueMessengers = Array.from(new Set(messages
    .map(msg => msg.sender.senderId)
    .filter(senderId => senderId !== loggedInUserId)
  )).map(senderId => messages.find(msg => msg.sender.senderId === senderId).sender);

  useEffect(() => {
    let isMounted = true;

    if (selectedMessenger) {
      const messageIdsToMarkAsRead = messages
        .filter(msg => 
          msg.receiver.senderId === loggedInUserId && 
          msg.sender.senderId === selectedMessenger.senderId && 
          !msg.read
        )
        .map(msg => msg.timestamp);

      if (isMounted) {
        markMessagesAsRead(messageIdsToMarkAsRead);
      }
    };

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box display="flex" backgroundColor={colors.primary[400]} height="100%">
      {/* Messenger List */}
      <Box
        width="30%"
        backgroundColor={colors.primary[500]}
        p="10px"
        overflow="auto"
        borderRight={`1px solid ${colors.grey[700]}`}
        height='100%'
      >
        <Typography variant="h5" fontWeight="600" mb="10px" color="white">
          Messengers
        </Typography>
        {uniqueMessengers.length > 0 ? (
          uniqueMessengers.map((messenger) => (
            <Box
              key={messenger.senderId}
              display="flex"
              alignItems="center"
              mb="15px"
              p="10px"
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedMessenger?.id === messenger.senderId ? colors.greenAccent[500] : 'inherit',
                borderRadius: '8px',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: colors.greenAccent[700],
                },
              }}
              onClick={() => handleMessengerClick(messenger.senderId)}
            >
              <Avatar src={messenger.picture} alt={messenger.name} sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6" color="white">{messenger.name}</Typography>
                <Typography variant="body2" color={colors.grey[300]}>{messenger.role}</Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography color="white">No messengers available</Typography>
        )}
      </Box>

      {/* Conversation Window */}
      <Box 
        width="70%" p="20px" 
        backgroundColor={colors.primary[400]}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {selectedMessenger ? (
          <Box height='100%'>
            <Typography variant="h6" mb="10px" color="white">
              Conversation with {selectedMessenger.firstName} {selectedMessenger.lastName}
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              gap="10px"
              height="65%"
              overflow="auto"
              paddingBottom="20px"
              borderTop={`1px solid ${colors.grey[700]}`}
            >
              {messages.filter(msg => 
                (msg.sender.senderId === selectedMessenger.id || msg.receiver.senderId === selectedMessenger.id)
              ).map((text, i) => (
                <Box key={i} display="flex" flexDirection="column" alignItems={text.sender.senderId === loggedInUserId ? 'flex-end' : 'flex-start'}>
                  <Typography
                    sx={{
                      color: text.sender.senderId === loggedInUserId ? colors.greenAccent[500] : 'white',
                      backgroundColor: text.sender.senderId === loggedInUserId ? colors.grey[800] : colors.grey[900],
                      borderRadius: '8px',
                      p: '10px',
                      maxWidth: '70%',
                      wordWrap: 'break-word',
                    }}
                  >
                    {text.message}
                  </Typography>
                  <Typography variant="caption" color={colors.grey[500]} alignSelf={text.sender.senderId === loggedInUserId ? 'flex-end' : 'flex-start'}>
                    {formatTimestamp(text.timestamp)} 
                    {text.sender.senderId === loggedInUserId ? ` | ${text.delivered ? 'Delivered' : 'Not Delivered'} | ${text.read ? 'Read' : 'Unread'}` : ''}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box display="flex" alignItems="center" mt="10px">
              <TextField
                variant="outlined"
                placeholder="Type a message..."
                fullWidth
                onChange={(e) => {
                  console.log("New message text:", e.target.value); // Debugging line
                  setNewMessage(e.target.value);
                }}
                value={newMessage}
                sx={{ mr: 1, backgroundColor: colors.grey[800] }}
              />
              <Button variant="contained" onClick={() => {
                  console.log("Sending message:", newMessage); // Debugging line
                  handleSendMessage();
                }} color="primary">
                Send
              </Button>
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
