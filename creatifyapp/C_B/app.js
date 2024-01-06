// Import necessary modules
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Connect to the database
require("./db/connection");

// Import Middleware
const authenticate = require("./middleware/auth");

// Set up middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Import Routers
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");

// Set up port
const port = process.env.PORT || 8000;

// Use Routers for specific routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

// ... (other routes)

// Start the server
app.listen(port, () => {
  console.log("Server is running on port", port);
});
