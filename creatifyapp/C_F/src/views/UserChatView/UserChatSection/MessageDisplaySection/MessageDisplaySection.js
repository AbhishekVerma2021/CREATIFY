import React, { useState, useEffect } from 'react';
import './MessageDisplaySection.css';
import ScrollableFeed from 'react-scrollable-feed';
import {
  Avatar,
  Paper, Tooltip, imageListClasses,
} from '@mui/material';
import { isLastMessage, isSameSender } from '../../../../utils/ChatLogics';
import typingGif from '../../../../images/typingDots.gif';


const MessageDisplaySection = (props) => {
  const {
    messages,
    activeUserDetails,
    SOCKET,
    setIsTyping,
    isTyping,
  } = props;

  // const [typing, setIsTyping] = useState(false);

  useEffect(() => {
    SOCKET.on("typing", () => setIsTyping(true));
    SOCKET.on("stop typing", () => setIsTyping(false));
  }, []);


  // console.log(messages)
  const { _id } = activeUserDetails;
  const activeUserId = _id;

  return (
    <>
      <ScrollableFeed className='scrollableFeedContainer'>

        {
          messages && messages.length > 0 && messages.map((message, index) => {
            const userflag = message.sender._id === activeUserId;
            const endMessageFlag = isSameSender(messages, message, index, activeUserId) || isLastMessage(messages, index, activeUserId)
            return (<div style={{
              display: 'flex',
              alignItems: 'center',
              display: 'flex',
              justifyContent: userflag ? 'end' : 'start',
              margin: '10px 0'
            }} elevation={3} key={message._id}>
              {
                endMessageFlag &&
                <Tooltip title={message.sender.username}>
                  <Avatar sx={{ margin: '0 10px 0 10px', bgcolor: 'red', height: "40px", width: "40px" }} aria-label="recipe">
                    <span>{message.sender.username.slice(0, 1).toUpperCase()}</span>
                  </Avatar>
                </Tooltip>

              }
              <Paper elevation={3} sx={{ backgroundColor: userflag ? '#1976d2d3' : '#808080bf', fontWeight: 700, color: 'white', padding: '8px', marginLeft: endMessageFlag ? '0' : '60px', marginRight: userflag ? '10px' : '0px', borderRadius: userflag ? '20px 20px 0 20px' : '20px 20px 20px 0' }}>
                <span>{message.content}</span>
              </Paper>
            </div>);

          })
        }
        {isTyping && <Paper elevation={3} sx={{height: '35px', width: '60px', marginLeft: '50px', marginBottom: '10px', backgroundColor: '#808080bf', padding: '8px',borderRadius: '20px 20px 20px 0'}} className='typingIndicator'>
          {/* <Tooltip title={messages[0].sender.username}>
            <Avatar sx={{ margin: '0 10px 0 0', bgcolor: 'red', height: "40px", width: "40px" }} aria-label="recipe">
              <span>{messages[0].sender.username.slice(0, 1).toUpperCase()}</span>
            </Avatar>
          </Tooltip> */}
          <img height={20} width={40} src={typingGif} alt="Typing...." />
        </Paper>}

      </ScrollableFeed>
    </>
  )
}

export default MessageDisplaySection