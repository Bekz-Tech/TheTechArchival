const multer = require('multer');

// Multer setup
const storage = multer.memoryStorage(); // Store in memory for uploading to Dropbox
const upload = multer({ storage });

// Middleware for handling file uploads for profile picture and ID card
const uploadImages = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'idCardUrl', maxCount: 1 }
]);

module.exports = { uploadImages };
