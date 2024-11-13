// routes/codeRoutes.js
const express = require("express");
const { generateCode, authenticateCode } = require("../controller/codeController");

const router = express.Router();

// Route to generate a new code
router.post("/api/v1/generate-code", generateCode);

// Route to authenticate an inputted code
router.post("/api/v1/authenticate-code", authenticateCode);

module.exports = router;