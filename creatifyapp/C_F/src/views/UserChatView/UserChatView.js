import React, { useEffect, useState } from 'react';
import './UserChatView.css';
import io from 'socket.io-client';

import UserChatSection from './UserChatSection';
import UserMessageList from './UserMessageList';
const BACKEND = 'http://localhost:8000';

let socket;
const UserChatView = (props) => {
  const [openedUserDetails, setOpenedUserDetails] = useState('');
  const [isGroupChatFlag, setIsGroupChatFlag] = useState(false);
  const [selectedChatDetails, setSelectedChatDetails] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [notificationFlag, setNotificationFlag]= useState(false);
  const {
    activeUserDetails,
    fetchAllChats,
    setSocketInStore,
  } = props;

  useEffect(() => {
    socket = io(BACKEND);
    socket.emit('setup', activeUserDetails);
    socket.on('connected', () => setSocketConnected(true));
    setSocketInStore(socket);
  },[]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        await fetchAllChats();
      }
      catch (err) {
        alert('Something went wrong!!');
      }
    };
    fetchChats();
  }, [])
  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       await fetchAllChats();
  //     }
  //     catch (err) {
  //       alert('Something went wrong!!');
  //     }
  //   };
  //   notificationFlag && fetchChats();
  //   // alert(JSON.stringify(notificationFlag))
  // }, [notificationFlag]);


  return (<>
    <div className="masterChatViewContainer">
      <UserMessageList setSelectedChatDetails={setSelectedChatDetails} setIsGroupChatFlag={setIsGroupChatFlag} setOpenedUserDetails={setOpenedUserDetails}/>
      {selectedChatDetails && socket && <UserChatSection setNotificationFlag={setNotificationFlag} socketConnected={socketConnected} socket={socket} selectedChatDetails={selectedChatDetails} isGroupChatFlag={isGroupChatFlag} openedUserDetails={openedUserDetails}/>}
    </div>
    </>);
}

export default UserChatView;