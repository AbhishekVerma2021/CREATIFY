import React, { useState, useEffect } from 'react';
import './MessageDisplaySection.css';
import ScrollableFeed from 'react-scrollable-feed';
import {
  Avatar,
  Paper,
  Tooltip,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import { isLastMessage, isSameSender } from '../../../../utils/ChatLogics';
import typingGif from '../../../../images/typingDots.gif';

const MessageDisplaySection = (props) => {
  const {
    messages,
    activeUserDetails,
    selectedChatSOCKET,
    setIsTyping,
    isTyping,
    selectedChatDetails, // ✅ Added
    isChatChanged,
    setIsChatChanged
  } = props;

  const [friendTyping, setFriendTyping] = useState(false);

  useEffect(() => {
    // Listen for typing events
    const handleFriendTyping = (data) => {
      // ✅ Only show typing if it's from the currently selected chat
      if (data.roomId === selectedChatDetails._id) {
        setFriendTyping(true);
        setIsChatChanged(false);
      }
      else {
        setFriendTyping(false);
      }
    };

    const handleFriendStoppedTyping = (data) => {
      // ✅ Only hide typing if it's from the currently selected chat
      if (data.roomId === selectedChatDetails._id) {
        setFriendTyping(false);
        setIsChatChanged(false);
      }
    };

    selectedChatSOCKET.on("friend-typing", handleFriendTyping);
    selectedChatSOCKET.on("friend-stopped-typing", handleFriendStoppedTyping);

    // Cleanup listeners on unmount or when chat changes
    return () => {
      selectedChatSOCKET.off("friend-typing", handleFriendTyping);
      selectedChatSOCKET.off("friend-stopped-typing", handleFriendStoppedTyping);
    };
  }, [selectedChatDetails._id, selectedChatSOCKET]);

  useEffect(() => {
    console.log('isChatChanged', isChatChanged)
    setFriendTyping(!isChatChanged);
  }, [isChatChanged]);

  const { _id } = activeUserDetails;
  const activeUserId = _id;

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <ScrollableFeed className='scrollableFeedContainer'>
        <Box sx={{ p: 2 }}>
          {messages && messages.length > 0 ? (
            messages.map((message, index) => {
              const userflag = message.sender._id === activeUserId;
              const endMessageFlag = isSameSender(messages, message, index, activeUserId) || isLastMessage(messages, index, activeUserId);
              
              return (
                <Stack
                  key={message._id}
                  direction="row"
                  spacing={1}
                  justifyContent={userflag ? 'flex-end' : 'flex-start'}
                  alignItems="flex-end"
                  sx={{ mb: 1.5 }}
                >
                  {!userflag && endMessageFlag && (
                    <Tooltip title={message.sender.username} placement="right">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {message.sender.username.slice(0, 1).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  )}
                  
                  <Paper
                    elevation={1}
                    sx={{
                      maxWidth: '70%',
                      px: 2,
                      py: 1.5,
                      bgcolor: userflag ? 'primary.main' : 'white',
                      color: userflag ? 'white' : 'text.primary',
                      borderRadius: userflag 
                        ? '16px 16px 4px 16px' 
                        : '16px 16px 16px 4px',
                      ml: !userflag && !endMessageFlag ? '40px' : 0,
                      boxShadow: userflag 
                        ? '0 2px 8px rgba(25, 118, 210, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>

                  {userflag && endMessageFlag && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.dark',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {message.sender.username.slice(0, 1).toUpperCase()}
                    </Avatar>
                  )}
                </Stack>
              );
            })
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                minHeight: '300px',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          )}
          
          {friendTyping && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-end"
              sx={{ mb: 1.5 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'grey.400',
                  fontSize: '0.875rem',
                }}
              >
                ⋯
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: 'white',
                  borderRadius: '16px 16px 16px 4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img height={20} width={40} src={typingGif} alt="Typing..." />
              </Paper>
            </Stack>
          )}
        </Box>
      </ScrollableFeed>
    </Box>
  );
}

export default MessageDisplaySection