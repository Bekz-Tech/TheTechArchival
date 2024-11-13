// controllers/codeController.js
const Code = require("../models/schema/codes");

exports.generateCode = async (req, res) => {
  const length = 11;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const now = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = now.toLocaleDateString("en-US", options);
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = now.toLocaleTimeString("en-US", timeOptions);

  const codeData = {
    code: result,
    generatedDate: formattedDate,
    generatedTime: formattedTime,
  };

  try {
    const code = await Code.create(codeData);
    res.status(201).json({ success: true, code });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ success: false, message: "Failed to generate code" });
  }
};


exports.authenticateCode = async (req, res) => {
  const { inputCode } = req.body;

  try {
    // Find the code in MongoDB
    const codeDoc = await Code.findOne({ code: inputCode });

    if (!codeDoc) {
      // If code doesn't exist
      return res.status(404).json({ error: "Invalid code. Please try again." });
    }

    if (codeDoc.used) {
      // If code is already used
      return res.status(400).json({ error: "This code has already been used." });
    }

    // Mark the code as used and set used date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

    codeDoc.used = true;
    codeDoc.usedDate = formattedDate;
    codeDoc.usedTime = formattedTime;

    await codeDoc.save();

    // Respond with success
    res.status(200).json({ message: "User authenticated successfully" });
  } catch (error) {
    console.error("Error checking code: ", error);
    res.status(500).json({ error: "An error occurred while checking the code." });
  }
};