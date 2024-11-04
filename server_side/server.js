// Importing required modules
const express = require("express");
const morgan = require("morgan"); // For logging
const helmet = require("helmet"); // For setting HTTP headers for security
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const dbConnection  = require("./models/dbconns");
const userRouter = require("./Routes/user");
const Student = require("./models/schema/user"); // Import the student schema

dotenv.config();
dbConnection();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;
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


// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
