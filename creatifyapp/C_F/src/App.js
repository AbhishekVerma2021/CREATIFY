import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react';
import HomePage from './views/HomePage';

import Login from './views/LoginSignup/Login';
import Signup from './views/LoginSignup/Signup';
import { toast, ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './views/Profile';
import Sidebar from './views/Sidebar';
import CreatePost from './views/CreatePost';
import Favourites from './views/Favourites';
import CommanProfileView from './views/CommanProfileView';
import UserChatView from './views/UserChatView';
import FullPageLoader from './LoadersAndShimmers/FullPageLoader';
import './App.css';
import { connect } from 'react-redux';
import { setSocketInStore, setPeerInStore } from './Redux/action';
import VideoCallView from './views/UserChatView/VideoCallView';
import io from 'socket.io-client';

let socket;
// Use IP address instead of localhost so it works on phone too
const BACKEND = 'http://172.24.171.114:8000';
// const BACKEND = 'http://192.168.29.122:8000';



const App = (props) => {
  const { SOCKET, PEER, activeUserDetails, setSocketInStore, setPeerInStore } = props;


  const [openCallDialog, setOpenCallDialog] = useState(false)
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [callersOffer, setCallersoffer] = useState(null)
  const [callerSocketRoomId, setCallerSocketRoomId] = useState(null)
  const [callerUserId, setCallerUserId] = useState(null)  // Caller's user ID for ICE candidates

  ////////////// SOCKET & PEER SETUP ////////////////////
  // Only initialize when user is logged in
  
  useEffect(() => {
    // Only set up socket/peer if user is logged in
    if (!activeUserDetails || !activeUserDetails._id) {
      console.log('User not logged in, skipping socket/peer setup');
      return;
    }

    // Prevent multiple connections
    if (socket && socket.connected) {
      console.log('Socket already connected, skipping setup');
      return;
    }

    console.log('Setting up socket connection in App.js for user:', activeUserDetails.email);
    
    // Setup socket
    socket = io(BACKEND);
    socket.emit('intiate-socket-setup', activeUserDetails);
    
    socket.on('socket-setup-success', () => {
      console.log('✅ Socket setup successful');
      setSocketInStore(socket);
    });

    // Create peer connection
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478"
          ],
        }
      ]
    });
    
    console.log('✅ Peer connection created');
    setPeerInStore(peer);

    // Cleanup function
    return () => {
      if (socket) {
        console.log('Cleaning up socket connection');
        socket.off('socket-setup-success');
        // Don't disconnect on unmount, only on logout
      }
    };
  }, [activeUserDetails]);

  ////////////// END SOCKET & PEER SETUP ////////////////////

  ////////////// GLOBAL VIDEO CALL LISTENERS ////////////////////
  // These listeners are active on ALL pages since App.js is always mounted
  
  const handleIncomingVideoCall = async (data) => {
    const { fromRoomId, offer, fromUserDetails } = data;
    console.log('📞 Incoming video call received in App.js');
    console.log('fromRoomId', fromRoomId);
    console.log('offer', offer);
    console.log('fromUserDetails', fromUserDetails);
    toast.info(`📞 Incoming video call from ${fromUserDetails.username}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    setOpenCallDialog(true);
    setIsVideoCall(true);
    setCallersoffer(offer);
    setCallerSocketRoomId(fromRoomId);
    setCallerUserId(fromUserDetails._id);  // Store caller's user ID for ICE candidates
  };

  // Note: Answer handling is now done in VideoCallView component via custom event
  const handleCallAccepted = (data) => {
    const { answerOffer } = data;
    console.log('✅ Call accepted! Answer received in App.js');
    
    toast.success('Call Accepted! 🎉', {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 3000,
    });
    
    // Dispatch custom event so VideoCallView can handle it
    window.dispatchEvent(new CustomEvent('video-call-answer-received', { 
      detail: { answerOffer } 
    }));
  };

  useEffect(() => {
    console.log('Setting up global video call listeners in App.js');
    // Only set up listeners if SOCKET exists and user is logged in
    if (!SOCKET || !activeUserDetails) {
      console.log('Socket not initialized or user not logged in, skipping listener setup');
      return;
    }
    
    SOCKET.on("incoming-video-call", handleIncomingVideoCall);
    SOCKET.on("called-user-accepted-your-call", handleCallAccepted);
    console.log('✅ Global video call listeners registered successfully');

    return () => {
      console.log('Cleaning up global video call listeners');
      SOCKET.off("incoming-video-call", handleIncomingVideoCall);
      SOCKET.off("called-user-accepted-your-call", handleCallAccepted);
    };
  }, [SOCKET, PEER, activeUserDetails]);
  
  ////////////// END GLOBAL VIDEO CALL LISTENER ////////////////////

  return (
    <div>
      <div className='routerContainer'>
        <Router>
          <Routes>
            <Route
              path='/' element={
                <Sidebar pageHeaderText={'HOME'}>
                  <ProtectedRoute componentPath={'/'} Component={HomePage} />
                </Sidebar>
              }
            />
            <Route path='/profile' element={
              <Sidebar pageHeaderText={'PROFILE'}>
                <ProtectedRoute componentPath={'/profile'} Component={Profile} />
              </Sidebar>
            }
            />
            <Route path='/createPost' element={
              <Sidebar pageHeaderText={'CREATE A NEW POST'}>
                <ProtectedRoute componentPath={'/createPost'} Component={CreatePost} />
              </Sidebar>
            }
            />
            <Route path='/favorites' element={
              <Sidebar pageHeaderText={'YOUR FAVORITES'}>
                <ProtectedRoute componentPath={'/favorites'} Component={Favourites} />
              </Sidebar>
            }
            />
            <Route path='/commanProfile' element={
              <Sidebar pageHeaderText={'YOUR PROFILE'}>
                <ProtectedRoute componentPath={'/commanProfile'} Component={CommanProfileView} />
              </Sidebar>
            }
            />
            <Route path='/messages' element={
              <Sidebar pageHeaderText={'YOUR CHATS'}>
                <ProtectedRoute componentPath={'/messages'} Component={UserChatView} />
              </Sidebar>
            }
            />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Router>
        <ToastContainer />
      </div>
      {openCallDialog && <VideoCallView
        openCallDialog={openCallDialog}
        handleCallDialog={setOpenCallDialog}
        isVideoCall={isVideoCall}
        callersOffer={callersOffer}
        callerRoomId={callerSocketRoomId}
        callerUserId={callerUserId}
        incomingCallFlag={true}
        SOCKET={SOCKET}
        activeUserDetails={activeUserDetails}
      />}
        <FullPageLoader />
    </div>
  );
}

const mapStateToProps = (state) => ({
  isFullPageloading: state.isFullPageloading,
  SOCKET: state.SOCKET,
  PEER: state.PEER,
  activeUserDetails: state.activeUserDetails, // Check if user is logged in
});

const mapDispatchToProps = (dispatch) => ({
  setSocketInStore: (socket) => dispatch(setSocketInStore(socket)),
  setPeerInStore: (peer) => dispatch(setPeerInStore(peer)),
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
