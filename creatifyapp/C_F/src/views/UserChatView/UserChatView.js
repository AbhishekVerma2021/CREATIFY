import React, { useEffect, useState } from 'react';
import './UserChatView.css';
import { Box, Typography, Paper, Stack } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import UserChatSection from './UserChatSection';
import UserMessageList from './UserMessageList';


const UserChatView = (props) => {
  const [openedUserDetails, setOpenedUserDetails] = useState('');
  const [isGroupChatFlag, setIsGroupChatFlag] = useState(false);
  const [selectedChatDetails, setSelectedChatDetails] = useState(null);
  const [notificationFlag, setNotificationFlag]= useState(false);
  const {
    activeUserDetails,
    fetchAllChats,
    SOCKET,
  } = props;


  
  const fetchChats = async () => {
    try {
      await fetchAllChats();
    }
    catch (err) {
      alert('Something went wrong!!');
    }
  };

  useEffect(() => {
    // Fetch chats
    fetchChats();
  }, []); // Empty dependency array - only run once



  return (
    <Box
      sx={{
        width: '100%',
        height: '85vh',
        display: 'flex',
        gap: 2,
        p: 2,
        bgcolor: 'grey.100',
      }}
    >
      <UserMessageList 
        setSelectedChatDetails={setSelectedChatDetails} 
        setIsGroupChatFlag={setIsGroupChatFlag} 
        setOpenedUserDetails={setOpenedUserDetails}
      />
      
      {selectedChatDetails && SOCKET ? (
        <UserChatSection 
          setNotificationFlag={setNotificationFlag} 
          socket={SOCKET} 
          selectedChatDetails={selectedChatDetails} 
          isGroupChatFlag={isGroupChatFlag} 
          openedUserDetails={openedUserDetails}
        />
      ) : (
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 80, opacity: 0.3 }} />
            <Typography variant="h5" fontWeight={500}>
              Select a chat to start messaging
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose from your existing conversations or start a new one
            </Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );

}

export default UserChatView;