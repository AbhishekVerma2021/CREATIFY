import { Dialog, DialogTitle, DialogActions, Button, DialogContent, Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const VideoCallView = (props) => {
    const {
        selectedChatDetails,
        openCallDialog,
        handleCallDialog,
        isVideoCall,
        callersOffer,
        SOCKET,
        callerRoomId,
        activeUserDetails,
        incomingCallFlag,
        callerUserId
    } = props;

    const videoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [connectionState, setConnectionState] = useState('new');
    const hasNegotiatedRef = useRef(false);
    const iceCandidatesQueue = useRef([]);
    const remoteDescriptionSet = useRef(false);

    const createPeerConnection = () => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] }]
        });

        peer.onconnectionstatechange = () => {
            console.log('Connection state:', peer.connectionState);
            setConnectionState(peer.connectionState);
            
            // When connected, try to get remote stream from transceivers
            if (peer.connectionState === 'connected') {
                console.log('🎉 Connection established! Checking for remote tracks...');
                const transceivers = peer.getTransceivers();
                const remoteTrackStream = new MediaStream();
                
                transceivers.forEach((t, i) => {
                    if ((t.currentDirection === 'recvonly' || t.direction === 'recvonly') && t.receiver.track) {
                        console.log(`Found remote track from transceiver ${i}: ${t.receiver.track.kind}`);
                        remoteTrackStream.addTrack(t.receiver.track);
                    }
                });
                
                if (remoteTrackStream.getTracks().length > 0) {
                    console.log('Setting remote stream from connection state change:', remoteTrackStream.getTracks().length, 'tracks');
                    setRemoteStream(remoteTrackStream);
                }
            }
        };

        peer.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', peer.iceConnectionState);
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                let targetUserId;
                if (incomingCallFlag) {
                    targetUserId = callerUserId;
                } else {
                    const receiver = selectedChatDetails?.users?.find(u => u._id !== activeUserDetails._id);
                    targetUserId = receiver?._id;
                }
                if (targetUserId && SOCKET) {
                    SOCKET.emit('ice-candidate', { candidate: event.candidate, targetUserId });
                }
            }
        };

        peer.ontrack = (event) => {
            console.log('🎬 ONTRACK EVENT FIRED!');
            console.log('Track kind:', event.track.kind);
            console.log('Track id:', event.track.id);
            console.log('Track enabled:', event.track.enabled);
            console.log('Track readyState:', event.track.readyState);
            console.log('Streams count:', event.streams?.length);
            if (event.streams && event.streams[0]) {
                console.log('Setting remote stream with tracks:', event.streams[0].getTracks().length);
                setRemoteStream(event.streams[0]);
            } else {
                console.warn('No streams in ontrack event!');
            }
        };

        setPeerConnection(peer);
        return peer;
    };

    useEffect(() => {
        const peer = createPeerConnection();
        return () => peer.close();
    }, []);

    useEffect(() => {
        if (!SOCKET || !peerConnection) return;
        const handleIceCandidate = async (data) => {
            try {
                if (remoteDescriptionSet.current) {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                } else {
                    iceCandidatesQueue.current.push(data.candidate);
                }
            } catch (err) {
                console.error('Error adding ICE candidate:', err);
            }
        };
        SOCKET.on('ice-candidate-received', handleIceCandidate);
        return () => SOCKET.off('ice-candidate-received', handleIceCandidate);
    }, [SOCKET, peerConnection]);

    const processQueuedCandidates = async () => {
        while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('Error adding queued ICE candidate:', err);
            }
        }
    };

    useEffect(() => {
        if (incomingCallFlag || !peerConnection) return;
        
        console.log('📞 CALLER: Setting up answer listener');
        
        const handleAnswerReceived = async (event) => {
            const { answerOffer } = event.detail;
            console.log('📥 CALLER: Received answer from receiver!');
            console.log('Answer type:', answerOffer?.type);
            console.log('Current signaling state:', peerConnection.signalingState);
            
            if (peerConnection.signalingState === 'have-local-offer') {
                try {
                    console.log('Setting remote description (answer)...');
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(answerOffer));
                    remoteDescriptionSet.current = true;
                    console.log('✅ Remote description set successfully');
                    console.log('New signaling state:', peerConnection.signalingState);
                    console.log('Connection state:', peerConnection.connectionState);
                    console.log('ICE connection state:', peerConnection.iceConnectionState);
                    await processQueuedCandidates();
                } catch (err) {
                    console.error('❌ Error setting remote description:', err);
                }
            } else {
                console.warn('⚠️ Wrong signaling state for answer:', peerConnection.signalingState);
            }
        };
        
        window.addEventListener('video-call-answer-received', handleAnswerReceived);
        return () => window.removeEventListener('video-call-answer-received', handleAnswerReceived);
    }, [peerConnection, incomingCallFlag]);

    const sendStream = (peer) => {
        if (!peer || !myStream) return;
        myStream.getTracks().forEach(track => peer.addTrack(track, myStream));
    };

    const getUserMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMyStream(stream);
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Could not access camera/microphone: ' + error.message);
        }
    };

    useEffect(() => {
        getUserMediaStream();
    }, []);

    useEffect(() => {
        if (myStream && videoRef.current) {
            videoRef.current.srcObject = myStream;
            videoRef.current.play().catch(console.error);
            if (!incomingCallFlag && peerConnection && !hasNegotiatedRef.current) {
                sendStream(peerConnection);
                (async () => {
                    try {
                        const offer = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
                        await peerConnection.setLocalDescription(offer);
                        const receiver = selectedChatDetails?.users?.find(u => u._id !== activeUserDetails._id);
                        SOCKET.emit("initiate-video-call", { roomId: selectedChatDetails._id, offer, recieverUserData: receiver, senderUserData: activeUserDetails });
                        hasNegotiatedRef.current = true;
                    } catch (err) {
                        console.error('Error creating offer:', err);
                    }
                })();
            }
        }
    }, [myStream, peerConnection]);

    useEffect(() => {
        if (!remoteStream || !remoteVideoRef.current) return;
        
        console.log('📺 Attaching remote stream to video element');
        console.log('Remote stream tracks:', remoteStream.getTracks().map(t => `${t.kind}:${t.readyState}`));
        
        // Only set srcObject if it's different
        if (remoteVideoRef.current.srcObject !== remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
        
        // Use a small delay to avoid play() interruption
        const playVideo = async () => {
            try {
                const videoEl = remoteVideoRef.current;
                console.log('Video element state before play:', {
                    readyState: videoEl.readyState,
                    videoWidth: videoEl.videoWidth,
                    videoHeight: videoEl.videoHeight,
                    srcObject: videoEl.srcObject ? 'set' : 'null',
                    paused: videoEl.paused
                });
                
                // Wait for loadedmetadata before playing
                if (videoEl.readyState < 2) {
                    console.log('Waiting for loadedmetadata...');
                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            console.log('loadedmetadata timeout, trying to play anyway');
                            resolve();
                        }, 3000);
                        videoEl.onloadedmetadata = () => {
                            clearTimeout(timeout);
                            console.log('loadedmetadata fired!', videoEl.videoWidth, 'x', videoEl.videoHeight);
                            resolve();
                        };
                    });
                }
                
                await videoEl.play();
                console.log('✅ Remote video playing!', {
                    videoWidth: videoEl.videoWidth,
                    videoHeight: videoEl.videoHeight,
                    paused: videoEl.paused
                });
            } catch (err) {
                console.error('❌ Error playing remote video:', err);
                // Retry after a short delay
                setTimeout(async () => {
                    try {
                        await remoteVideoRef.current?.play();
                        console.log('✅ Remote video playing (retry)!');
                    } catch (e) {
                        console.error('❌ Retry failed:', e);
                    }
                }, 500);
            }
        };
        
        playVideo();
    }, [remoteStream]);

    useEffect(() => {
        return () => {
            if (myStream) myStream.getTracks().forEach(track => track.stop());
        };
    }, [myStream]);

    const handleClose = () => {
        if (videoRef.current) videoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (myStream) myStream.getTracks().forEach(track => track.stop());
        if (peerConnection) peerConnection.close();
        setMyStream(null);
        setRemoteStream(null);
        hasNegotiatedRef.current = false;
        remoteDescriptionSet.current = false;
        handleCallDialog(false);
    };

    const handleAcceptCall = async () => {
        console.log('📞 handleAcceptCall called');
        console.log('myStream:', myStream ? 'exists' : 'null');
        console.log('peerConnection:', peerConnection ? 'exists' : 'null');
        console.log('callersOffer:', callersOffer);
        console.log('callerUserId:', callerUserId);
        
        if (!myStream || !peerConnection) {
            console.error('Missing myStream or peerConnection');
            return;
        }
        
        try {
            // Step 1: Set remote description FIRST (this triggers ontrack for caller's tracks)
            console.log('Step 1: Setting remote description (caller offer)');
            console.log('Signaling state before:', peerConnection.signalingState);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(callersOffer));
            console.log('Signaling state after setRemoteDescription:', peerConnection.signalingState);
            remoteDescriptionSet.current = true;
            
            // Step 2: Add our tracks AFTER setting remote description
            console.log('Step 2: Adding tracks to peer connection');
            sendStream(peerConnection);
            console.log('Senders after adding tracks:', peerConnection.getSenders().length);
            
            // Step 3: Process queued ICE candidates
            console.log('Step 3: Processing queued ICE candidates');
            await processQueuedCandidates();
            
            // Step 4: Create answer
            console.log('Step 4: Creating answer');
            const answer = await peerConnection.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            console.log('Answer created:', answer.type);
            
            // Step 5: Set local description
            console.log('Step 5: Setting local description');
            await peerConnection.setLocalDescription(answer);
            console.log('Signaling state after setLocalDescription:', peerConnection.signalingState);
            
            // Step 6: Send answer to caller
            console.log('Step 6: Sending answer to caller');
            console.log('Emitting video-call-accepted with callerUserId:', callerUserId);
            SOCKET.emit('video-call-accepted', { answerOffer: answer, callerRoomId, callerUserId });
            
            console.log('✅ Call accepted successfully!');
            console.log('Connection state:', peerConnection.connectionState);
            console.log('ICE connection state:', peerConnection.iceConnectionState);
            
            // Debug: Check receivers (incoming tracks from caller)
            const receivers = peerConnection.getReceivers();
            console.log('Receivers count:', receivers.length);
            receivers.forEach((receiver, i) => {
                console.log(`Receiver ${i}:`, receiver.track?.kind, receiver.track?.readyState);
            });
            
            // Debug: Check transceivers
            const transceivers = peerConnection.getTransceivers();
            console.log('Transceivers count:', transceivers.length);
            transceivers.forEach((t, i) => {
                console.log(`Transceiver ${i}: direction=${t.direction}, currentDirection=${t.currentDirection}`);
                if (t.receiver.track) {
                    console.log(`  Receiver track: ${t.receiver.track.kind}, readyState=${t.receiver.track.readyState}`);
                }
            });
            
            // FALLBACK: If ontrack didn't fire, manually create stream from transceivers
            // Only use transceivers with recvonly direction (incoming tracks from remote peer)
            if (!remoteStream && transceivers.length > 0) {
                console.log('⚠️ ontrack did not fire, manually creating remote stream from transceivers');
                const manualStream = new MediaStream();
                
                transceivers.forEach((t, i) => {
                    // Only get tracks from recvonly transceivers (these are from the remote peer)
                    if (t.currentDirection === 'recvonly' && t.receiver.track) {
                        console.log(`Adding recvonly track ${i}: ${t.receiver.track.kind}`);
                        manualStream.addTrack(t.receiver.track);
                    }
                });
                
                // If no recvonly tracks, try sendrecv but only take one of each kind
                if (manualStream.getTracks().length === 0) {
                    let hasAudio = false;
                    let hasVideo = false;
                    transceivers.forEach((t, i) => {
                        if (t.receiver.track && t.receiver.track.readyState === 'live') {
                            if (t.receiver.track.kind === 'audio' && !hasAudio) {
                                manualStream.addTrack(t.receiver.track);
                                hasAudio = true;
                                console.log(`Adding first audio track from transceiver ${i}`);
                            } else if (t.receiver.track.kind === 'video' && !hasVideo) {
                                manualStream.addTrack(t.receiver.track);
                                hasVideo = true;
                                console.log(`Adding first video track from transceiver ${i}`);
                            }
                        }
                    });
                }
                
                if (manualStream.getTracks().length > 0) {
                    console.log('Setting manual remote stream with', manualStream.getTracks().length, 'tracks');
                    setRemoteStream(manualStream);
                }
            }
        } catch (err) {
            console.error('❌ Error accepting call:', err);
            console.error('Error stack:', err.stack);
        }
    };

    return (
        <Dialog open={openCallDialog} maxWidth="lg" fullWidth>
            <DialogTitle>{isVideoCall ? "Video Call" : "Audio Call"}</DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <h3>{incomingCallFlag ? "Incoming Call" : "Calling..."}</h3>
                    <Box sx={{ position: 'relative', width: '100%', height: 480 }}>
                        {/* Remote video - always render, use visibility instead of display */}
                        <video 
                            ref={remoteVideoRef} 
                            autoPlay 
                            playsInline
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                backgroundColor: '#000', 
                                borderRadius: '8px', 
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }} 
                        />
                        {!remoteStream && (
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', gap: 2, zIndex: 1 }}>
                                <div>{incomingCallFlag ? 'Waiting for caller...' : 'Connecting...'}</div>
                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Connection: {connectionState}</div>
                            </Box>
                        )}
                        {myStream && (
                            <Box sx={{ position: 'absolute', bottom: 16, right: 16, width: 150, height: 110, borderRadius: '8px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', backgroundColor: '#000', objectFit: 'cover' }} />
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                {incomingCallFlag && <Button onClick={handleAcceptCall} color="primary">Accept</Button>}
                <Button onClick={handleClose} color="error">HangUp</Button>
            </DialogActions>
        </Dialog>
    );
};

export default VideoCallView;
