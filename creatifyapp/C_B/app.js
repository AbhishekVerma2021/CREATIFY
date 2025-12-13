// Import necessary modules
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io"); // Import Socket.io Server
const http = require('http');  // Import http module
const app = express();

// Connect to the database
require("./db/connection");


// app.use(bodyParser.json());
// If you're using express.json() (which is just a built-in wrapper around body-parser), you don't need to use bodyParser.json() separately. Having both might cause conflicts. Stick with express.json() and express.urlencoded().
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

// Configure CORS to allow both localhost and network IP
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.29.122:3000', 'http://172.24.171.114:3000' , "https://nonvacuous-arianna-subreniform.ngrok-free.dev"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Import Routers
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");

// Set up port
const port = process.env.PORT || 8000;

// Use Routers for specific routes
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", chatRouter);
app.use("/api", messageRouter);

// Initialize Socket.io Server
const server = http.createServer(app);  // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.29.122:3000', 'http://172.24.171.114:3000', "https://nonvacuous-arianna-subreniform.ngrok-free.dev"], // Allow both localhost and network IP
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
});  // Attach Socket.io to HTTP server

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('intiate-socket-setup', (userData) => {
    console.log(`Socket room initiated by user: ${userData.email} \nuserID/roomID/socketId: ${userData._id}`);
    socket.join(userData._id);
    socket.emit("socket-setup-success");
  });

  socket.on('joined-room', (roomId) => {
    socket.join(roomId);  
    console.log('Joined : ', roomId);
    // Leave the previously joined room (if any)
    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    socket.join(roomId);
    socket.emit("Room Joined");
  });


  socket.on("user-typing", (roomId) => {
    socket.in(roomId).emit("friend-typing",{roomId});
  });

  
  socket.on("user-stopped-typing", (roomId) => {
    socket.in(roomId).emit("friend-stopped-typing", {roomId});
  });
  socket.on('new message', (newMessageRecieved) => {
    // console.log('newMessageRecieved!',newMessageRecieved);
    let chat = newMessageRecieved.chat;
    if(!chat.users) console.log('chat.users is empty!!');
    chat.users.map(user => {
      if(user._id === newMessageRecieved.sender._id) return;
      console.log(newMessageRecieved)
      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

////////////// VIDEO CALL LOGIC ////////////////////

socket.on("initiate-video-call", (data) => {
  const { roomId, offer, recieverUserData, senderUserData } = data;
  console.log('📞 Video call initiated:', data);
  console.log('📤 Sending to receiver ID:', recieverUserData._id);
  
  // Send to RECEIVER'S PERSONAL ROOM (not chat room)
  // This ensures receiver gets notification anywhere in app
  io.to(recieverUserData._id).emit("incoming-video-call", { 
    fromRoomId: roomId, 
    offer, 
    fromUserDetails: {
      _id: senderUserData._id,  // Include caller's user ID
      email: senderUserData.email, 
      username: senderUserData.username, 
      image: senderUserData.image
    } 
  });
  
  console.log('✅ Call notification sent to receiver:', recieverUserData.username);
});


socket.on('video-call-accepted', (data) => {
  const { answerOffer, callerRoomId, callerUserId } = data;
  console.log('📞 Call accepted, sending answer to caller:', callerUserId);
  // Send to caller's PERSONAL room (not chat room) to ensure they receive it
  io.to(callerUserId).emit('called-user-accepted-your-call', { answerOffer });
});

// ICE Candidate exchange - Caller sends candidate to receiver
socket.on('ice-candidate', (data) => {
  const { candidate, targetUserId } = data;
  console.log('🧊 ICE candidate received, forwarding to:', targetUserId);
  io.to(targetUserId).emit('ice-candidate-received', { candidate });
});

////////////// END VIDEO CALL LOGIC ////////////////////






  socket.on('disconnect', () => {
    console.log('User Disconnected');
    // Socket.io automatically removes user from all rooms on disconnect
  });

});

// Start the server - Listen on all network interfaces (0.0.0.0) to accept connections from local network
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Local: http://localhost:${port}`);
  // console.log(`Network: http://192.168.29.122:${port}`);
  console.log(`Network: http://172.24.171.114:${port}`);
});
