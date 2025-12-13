import React, { useEffect, useState } from 'react';
import './UserMessageList.css';
import {
  Autocomplete,
  Box,
  Paper,
  TextField,
  Avatar,
  Button,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CreateGroupDialog from './CreateGroupDialog';
import { getSender } from '../../../utils/ChatLogics';

const UserMessageList = (props) => {

  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openGroupDialog, setOpenGropuDialog] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const {
    allUsersList,
    createNewChat,
    allUserChats,
    activeUserDetails,
    setIsGroupChatFlag,
    setOpenedUserDetails,
    setSelectedChatDetails,
    SOCKET,
    fetchAllChats,
  } = props;

  useEffect(()=> {
    const fetchChats = async () => {
      try {
        await fetchAllChats();
      }
      catch (err) {
        alert('Something went wrong!!');
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (allUsersList && allUsersList.length > 0) {
      // Filter out any users without a valid username
      const profileNameArray = allUsersList
        .filter(user => user && user.username)
        .map(user => user.username);
      setAutoCompleteData(profileNameArray);
    } else {
      setAutoCompleteData([]);
    }
  }, [allUsersList]);

  useEffect(() => {
    // console.log('------------>', autoCompleteData)
  }, [allUserChats]);

  const handleAccessChat = async (chat) => {
    try {
      const { _id } = chat;
      await createNewChat(_id);
    }
    catch (err) {
      alert('Something went wrong!!')
    }
  }

  const handleDialogClose = () => {
    setOpenGropuDialog(false);
  }

  const handleCreateGroup = () => {
    setOpenGropuDialog(true);
  }

  return (<>
    <Paper 
      elevation={3} 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '30%',
        minWidth: '320px',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Messages
        </Typography>
        <IconButton
          onClick={() => handleCreateGroup()}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
          }}
        >
          <AddIcon sx={{ fontSize: 28, color: 'white' }} />
        </IconButton>
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Autocomplete
          disablePortal
          id="search-users"
          options={autoCompleteData || []}
          getOptionLabel={(option) => option || ''}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={(event, newValue) => {
            if (!newValue) return; // Handle clearing selection
            const selectedUserData = allUsersList?.find(user => user.username === newValue);
            if (selectedUserData) {
              setSelectedUser(selectedUserData);
              handleAccessChat(selectedUserData);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search users..."
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
              sx={{
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          )}
        />
      </Box>

      {/* Chat List */}
      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 0,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
        }}
      >
        {allUserChats && allUserChats.length > 0 ? (
          allUserChats.map((userChat, index) => {
            const chatName = !userChat.isGroupChat 
              ? getSender(activeUserDetails, userChat.users).username 
              : userChat.chatName;
            const isSelected = selectedChat && selectedChat._id === userChat._id;

            return (
              <React.Fragment key={userChat._id}>
                <ListItem
                  button
                  onClick={() => {
                    SOCKET && SOCKET.emit('joined-room', userChat._id);
                    setIsGroupChatFlag(userChat.isGroupChat);
                    setSelectedChatDetails(userChat);
                    setSelectedChat(userChat);
                    setOpenedUserDetails(!userChat.isGroupChat ? getSender(activeUserDetails, userChat.users) : userChat.chatName);
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor: isSelected ? 'primary.light' : 'transparent',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.light' : 'action.hover',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: isSelected ? 'primary.dark' : 'primary.main',
                        width: 48,
                        height: 48,
                        fontWeight: 600,
                      }}
                    >
                      {chatName.slice(0, 1).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {chatName}
                        </Typography>
                        {userChat.isGroupChat && (
                          <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        )}
                      </Stack>
                    }
                    secondary={
                      userChat.latestMessage && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mt: 0.5,
                          }}
                        >
                          <Typography component="span" fontWeight={600} variant="body2">
                            {userChat.latestMessage.sender.username}:
                          </Typography>{' '}
                          {userChat.latestMessage.content.length > 35
                            ? userChat.latestMessage.content.substring(0, 35) + '...'
                            : userChat.latestMessage.content}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                {index < allUserChats.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No chats yet. Search for users to start chatting!
            </Typography>
          </Box>
        )}
      </List>

      <CreateGroupDialog autoCompleteData={autoCompleteData} open={openGroupDialog} handleDialogClose={handleDialogClose} />
    </Paper>
  </>);
}

export default UserMessageList;