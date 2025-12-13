import React, { useEffect, useState, useMemo } from 'react';
import './UserChatSection.css';
import { IconButton, Paper, TextField, Box, Typography, Stack, InputAdornment, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import VideoCallView from '../VideoCallView';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
// import { getSender } from '../../../utils/ChatLogics';
import { useNavigate } from 'react-router-dom';
import EditGroupDialog from './EditGroupDialog';
import MessageDisplaySection from './MessageDisplaySection';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CallIcon from '@mui/icons-material/Call';
import { createOffer } from '../../../utils/VideoCallLogic';
let selectedChatCompare;

const UserChatSection = (props) => {

  // let SOCKET, ;
  const {
    activeUserDetails,
  } = props;

  // SOCKET IO IMPLEMENTATION
  // const [SOCKETFlag, setSocketFlag] = useState(false);

  const {
    openedUserDetails,
    isGroupChatFlag,
    fetchProfileIdDetails,
    selectedChatDetails,
    allUserChats,
    sendMessage,
    activeChatMessagesArray,
    fetchAllMessagesOfChat,
    SOCKET,
    notifications,
    setPeerInStore,
    PEER,
    setNotificationArray,
    fetchAllChats,
    ussToken,
    setNotificationFlag,
  } = props;

  const { username, email, _id } = openedUserDetails // Reciever User Details
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [groupChatDetails, setGroupChatDetails] = useState(null);
  const [oneToOneChatDetails, setOneToOneChatDetails] = useState(null);
  const [chatName, setChatName] = useState('');
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isChatChanged, setIsChatChanged] = useState(false);

  const handleProfileViewClick = async () => {
    try {
      await fetchProfileIdDetails(_id);
      navigate('/commanProfile')
    }
    catch (er) {
      alert('Something Went wrong!!!')
    }
  };

//////////////////// Video Call Socket Logic ////////////////////



const handleVideoCall = async () => {
  try {
    console.log('📞 Initiating video call...');
    setIsCallDialogOpen(true);
    setIsVideoCall(true);
    
    // VideoCallView will handle:
    // 1. Getting camera stream
    // 2. Adding tracks to PEER
    // 3. Creating offer (via negotiationneeded event)
    // 4. Sending offer to backend
    
    console.log('✅ Video call dialog opened - waiting for camera and negotiation');
  }
  catch (err) {
    console.error('❌ Error initiating video call:', err);
    alert('Something Went wrong!!!')
  }
}

/////////////////// End Audio Call Socket Logic ////////////////////

const handleAudioCall = async () => {
  try {
    alert('Audio Call Initiated')
    setIsCallDialogOpen(true);
    setIsVideoCall(false);
    
    // Create a new RTCPeerConnection for this video call
    // const peer = new RTCPeerConnection({
    //   iceServers: [
    //     {
    //       urls: [
    //         "stun:stun.l.google.com:19302",     // ICE Servers that get my public IP Address
    //         "stun:global.stun.twilio.com:3478"  // then this public IP is used to connect to the other user
    //       ],
    //     }
    //   ]
    // });
    
    // setPeerInStore(peer);
    // const offer = await createOffer(peer);
    // console.log('offer', offer)
    // console.log('selectedChatDetails', selectedChatDetails)
    // console.log('_id', _id)
    
    // SOCKET.emit("initiate-video-call", { roomId: selectedChatDetails._id, offer, senderId: _id })
    
  }
  catch (err) {
    alert('Something Went wrong!!!')
  }
}

/////////////////// End Audio Call Socket Logic ////////////////////

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  }

  useEffect(() => {
    setMessages(activeChatMessagesArray)
  }, [activeChatMessagesArray]);

  useEffect(() => {
    selectedChatDetails && allUserChats && allUserChats.length > 0 && allUserChats.map(chat => {
      if (chat._id === selectedChatDetails._id && chat.isGroupChat) {
        setChatName(chat.chatName);
        setGroupChatDetails(chat);
      }
    });
    setIsChatChanged(true);
  }, [allUserChats])

  useEffect(() => {
    if (isGroupChatFlag) {
      setGroupChatDetails(selectedChatDetails);
    } else {
      setOneToOneChatDetails(selectedChatDetails);
    }
    const fetchSelectedChatsMessages = async () => {
      const { _id } = selectedChatDetails;
      console.log(_id)
      try {
        await fetchAllMessagesOfChat(_id);

        selectedChatCompare = selectedChatDetails;
        
      }
      catch (err) {

        alert('Something went wrong!!]')
      }
    }
    selectedChatDetails && fetchSelectedChatsMessages();
    setIsChatChanged(true);
  }, [selectedChatDetails]);

  useEffect(() => {
    SOCKET.on("message recieved", (newMessageRecieved) => {
      // console.log('newMessageRecieved--->', newMessageRecieved)
      // alert('newMessageRecieved')
      // console.log(selectedChatCompare, newMessageRecieved)
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        // give notification
        if(!notifications.includes(newMessageRecieved)) {
          // setNotificationArray(newMessageRecieved);
          // setNotificationFlag(true);
        }
      }
      else {
        // console.log('newMessageRecieved---+', newMessageRecieved)
        setMessages([...messages, newMessageRecieved])
      }
    });
  }, []);
  // console.log(activeChatMessagesArray)

  const handleSendingMessage = async (e, keyFlag) => {
    const { _id } = selectedChatDetails;
    try {
      if ((!keyFlag && e.type === 'click') || (keyFlag && e.key === 'Enter' && !e.shiftKey && messageText.length > 0)) {
        e.preventDefault();
        await sendMessage(_id, messageText);
        setMessageText('');
        SOCKET.emit("stop typing", _id);
      }
    }
    catch (err) {
      alert('Something went wrong!!!')
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (!SOCKET.connected) return;
    if (!typing && selectedChatDetails) {
      setTyping(true);
      SOCKET.emit("user-typing", selectedChatDetails._id)
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDifference = currentTime - lastTypingTime;
      if (timeDifference > timerLength && typing) {
        SOCKET.emit("user-stopped-typing", selectedChatDetails._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (<>
    <Paper 
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: 1,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 1,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: 'primary.dark',
              width: 48,
              height: 48,
              fontWeight: 600,
            }}
          >
            {(!isGroupChatFlag ? username : chatName)?.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{
              cursor: "pointer"
            }} onClick={() => !isGroupChatFlag && handleProfileViewClick()} fontWeight={600}>
              {!isGroupChatFlag ? username : chatName}
            </Typography>
            {isGroupChatFlag && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Group Chat
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="right">
        <IconButton
          onClick={() => isGroupChatFlag ? setOpenEditDialog(true) : ""}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          {isGroupChatFlag && <SettingsIcon sx={{ fontSize: 28 }} />}
        </IconButton>
        <IconButton
          onClick={() => handleVideoCall()}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          {isGroupChatFlag ? (
            <VideoCameraFrontIcon sx={{ fontSize: 28 }} />
          ) : (
            <VideoCameraFrontIcon sx={{ fontSize: 28 }} />
          )}
        </IconButton>
        <IconButton
          onClick={() => handleAudioCall()}
          sx={{
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          {isGroupChatFlag ? (
            <CallIcon sx={{ fontSize: 28 }} />
          ) : (
            <CallIcon sx={{ fontSize: 28 }} />
          )}
        </IconButton>
      </Stack>
      </Box>

      {/* Message Display Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          bgcolor: 'grey.50',
        }}
      >
        <MessageDisplaySection isChatChanged={isChatChanged} setIsChatChanged={setIsChatChanged} selectedChatSOCKET={SOCKET} selectedChatDetails={selectedChatDetails} messages={messages} />
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={messageText}
            onKeyDown={(e) => handleSendingMessage(e, true)}
            onChange={(e) => handleTyping(e)}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'grey.50',
              },
            }}
          />
          <IconButton
            disabled={messageText.length === 0}
            onClick={(e) => handleSendingMessage(e, false)}
            sx={{
              bgcolor: messageText.length === 0 ? 'grey.300' : 'primary.main',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                bgcolor: messageText.length === 0 ? 'grey.300' : 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>

      {isGroupChatFlag && groupChatDetails && <EditGroupDialog
        openEditDialog={openEditDialog}
        groupDetails={groupChatDetails}
        handleEditDialogClose={handleEditDialogClose}
      />}
      {isCallDialogOpen && <VideoCallView
        selectedChatDetails={selectedChatDetails}
        openCallDialog={isCallDialogOpen}
        handleCallDialog={setIsCallDialogOpen}
        isVideoCall={isVideoCall}
        incomingCallFlag={false}
        SOCKET={SOCKET}
        activeUserDetails={activeUserDetails}
      />}
    </Paper>
  </>);
}

export default UserChatSection;