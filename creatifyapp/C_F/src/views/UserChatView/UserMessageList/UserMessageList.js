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
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
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
      const profileNameArray = allUsersList.map(user => user.username);
      setAutoCompleteData(profileNameArray);
    }
  }, [allUsersList]);

  useEffect(() => {
    console.log('------------>', autoCompleteData)

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
    <Paper elevation={5} className="userMessageListSectionMasterContainer">
      <div className="mychatsHeader">
        <span>My Chats</span>
        <Button onClick={() => handleCreateGroup()}>
          <IconButton>
            <GroupsIcon sx={{ fontSize: 30, color: 'white' }} />
          </IconButton>
        </Button>
      </div>
      <div className="userSearchBarConatiner">
        <Box
          role="presentation"
          sx={{
            width: "100%",
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={autoCompleteData}
            onChange={(event, newValue) => {
              const selectedUserData = allUsersList.find(user => user.username === newValue);
              setSelectedUser(selectedUserData);
              handleAccessChat(selectedUserData);
            }}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Search User" />}
          />
        </Box>
      </div>
      <div className="userChatsListContainer">
        {allUserChats && allUserChats.length > 0 && allUserChats.map((userChat) => {
          return <Paper elevation={3} className="userChatCard" onClick={() => {
            SOCKET && SOCKET.emit('join room', userChat._id);
            setIsGroupChatFlag(userChat.isGroupChat);
            setSelectedChatDetails(userChat);
            setSelectedChat(userChat);
            setOpenedUserDetails(!userChat.isGroupChat ? getSender(activeUserDetails, userChat.users) : userChat.chatName);
          }}>
            <Avatar sx={{ bgcolor: 'red', height: "40px", width: "40px" }} aria-label="recipe">
              <span>{(!userChat.isGroupChat ? getSender(activeUserDetails, userChat.users).username : userChat.chatName).slice(0, 1).toUpperCase()}</span>
            </Avatar>
            <div className="messageCardDetailContainer">
              <div className='chatUserNameContaiener'>
                {!userChat.isGroupChat ? getSender(activeUserDetails, userChat.users).username : userChat.chatName}
              </div>

              {userChat.latestMessage && <div className='latestMessageContainer'>
                <b>{userChat.latestMessage.sender.username} : </b>
                {userChat.latestMessage.content.length > 50
                  ? userChat.latestMessage.content.substring(0, 51) + "..."
                  : userChat.latestMessage.content}
              </div>}
            </div>
          </Paper>
        })}
      </div>
      <CreateGroupDialog autoCompleteData={autoCompleteData} open={openGroupDialog} handleDialogClose={handleDialogClose} />
    </Paper>
  </>);
}

export default UserMessageList;