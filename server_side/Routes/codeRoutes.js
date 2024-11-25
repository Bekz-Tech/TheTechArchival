const express = require("express");
const router = express.Router();
const {
  authenticateCode,
  storeGeneratedCode,
  getAllCodes,
} = require("../controller/codeController");

// Route to authenticate a code
router.post("/api/v1/authenticate-code", authenticateCode);

// Route to store a generated code
router.post("/api/v1/store-code", storeGeneratedCode);

// Route to get all codes
router.get("/api/v1/get-codes", getAllCodes);

module.exports = router;
