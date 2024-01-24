import React, { useEffect, useState } from 'react';
import './UserChatSection.css';
import { IconButton, Paper, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
// import { getSender } from '../../../utils/ChatLogics';
import { useNavigate } from 'react-router-dom';
import EditGroupDialog from './EditGroupDialog';
import MessageDisplaySection from './MessageDisplaySection';


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
    socketConnected,
    notifications,
    setNotificationArray,
    fetchAllChats,
    ussToken,
    setNotificationFlag,
  } = props;

  const { username, email, _id } = openedUserDetails
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [groupChatDetails, setGroupChatDetails] = useState(null);
  const [oneToOneChatDetails, setOneToOneChatDetails] = useState(null);
  const [chatName, setChatName] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleProfileViewClick = async () => {
    try {
      await fetchProfileIdDetails(_id);
      navigate('/commanProfile')
    }
    catch (er) {
      alert('Something Went wrong!!!')
    }
  };

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
  }, [selectedChatDetails]);

  useEffect(() => {
    SOCKET.on("message recieved", (newMessageRecieved) => {
      // console.log('newMessageRecieved--->', newMessageRecieved)
      // alert('newMessageRecieved')
      console.log(selectedChatCompare, newMessageRecieved)
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        // give notification
        if(!notifications.includes(newMessageRecieved)) {
          setNotificationArray(newMessageRecieved);
          setNotificationFlag(true);
        }
      }
      else {
        // console.log('newMessageRecieved---+', newMessageRecieved)
        setMessages([...messages, newMessageRecieved])
      }
    });
  });
  // console.log(activeChatMessagesArray)

  const handleSendingMessage = async (e, keyFlag) => {
    const { _id } = selectedChatDetails;
    try {
      if ((!keyFlag && e.type === 'click') || (keyFlag && e.key === 'Enter' && messageText.length > 0)) {
        await sendMessage(_id, messageText);
        SOCKET.emit("stop typing", _id);
      }
    }
    catch (err) {
      alert('Something went wrong!!!')
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (!socketConnected) return;
    if (!typing && selectedChatDetails) {
      setTyping(true);
      SOCKET.emit("typing", selectedChatDetails._id)
    }
    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDifference = currentTime - lastTypingTime;
      if (timeDifference > timerLength && typing) {
        SOCKET.emit("stop typing", selectedChatDetails._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (<>
    <Paper elevation={5} className="masterUserChatSectionContainer">
      <div className="ChatBoxHeaderContainer">
        <span className="usernametextHeader">
          {!isGroupChatFlag ? username : chatName}
        </span>
        <span className="chatuserProfileCOntainer">
          {isGroupChatFlag ? <IconButton onClick={() => setOpenEditDialog(true)}>
            <SettingsApplicationsIcon sx={{ color: 'white', fontSize: 40 }} />
          </IconButton> : <IconButton onClick={() => handleProfileViewClick()}>
            <AccountBoxIcon sx={{ color: 'white', fontSize: 40 }} />
          </IconButton>}
        </span>
      </div>
      <div className="chatboxChatDiaplayArea">
        <MessageDisplaySection setIsTyping={setIsTyping} isTyping={isTyping} messages={messages} />
      </div>
      <div className="chatBoxSenMessageTextfieldContainer">
        <div className="sendMessageTextFieldContainer">

          <TextField
            required
            fullWidth
            id="standard-required"
            label="Required"
            onKeyDown={(e) => handleSendingMessage(e, true)}
            onChange={(e) => handleTyping(e)}
            variant="standard"
          />
        </div>
        <div className="sendButtonContainer">
          <IconButton id='sendIcon' disabled={messageText.length === 0} onClick={(e) => handleSendingMessage(e, false)}>
            <SendIcon sx={{ color: 'white' }} />
          </IconButton>
        </div>
      </div>
      {isGroupChatFlag && groupChatDetails && <EditGroupDialog
        openEditDialog={openEditDialog}
        groupDetails={groupChatDetails}
        handleEditDialogClose={handleEditDialogClose}
      />}
    </Paper>
  </>);
}

export default UserChatSection;