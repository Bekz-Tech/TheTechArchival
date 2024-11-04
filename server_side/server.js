// Importing required modules
const express = require("express");
const morgan = require("morgan"); // For logging
const helmet = require("helmet"); // For setting HTTP headers for security
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const http = require("http"); // Import the HTTP server
const dbConnection = require("./models/dbconns");
const userRouter = require("./Routes/user");
const admin = require("firebase-admin");
const envConfig = require('./configs/dotenv')

const serviceAccount = require("./configs/thetecharchival-firebase-adminsdk-1e78n-bf5af37d03.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Import the WebSocket logic
const { videocallSignal } = require("./videoCall/websocketServer");

dotenv.config();
dbConnection();

// Initialize the Express app
const app = express();
const PORT = envConfig.PORT || 3000;
const logFile = fs.createWriteStream(path.join(__dirname, "logFile.log"), {
  flags: "a",
});

// Middleware functions
app.use(helmet());
app.use(morgan("dev", { stream: logFile }));
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(userRouter);

// Create the HTTP server from the Express app
const server = http.createServer(app);

videocallSignal(server);

// Start the HTTP and WebSocket server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
