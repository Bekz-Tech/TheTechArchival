const multer = require('multer');
const path = require('path');

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 'req' can be used if needed in the future for accessing form data or user info
    cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // 'file' is used here to append the correct file extension
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp for unique file names
  }
});

// Create a multer instance with the storage configuration
const upload = multer({ storage });

// Middleware to handle single or multiple file uploads
const uploadFiles = upload.fields([
  { name: 'profilePictureUrl', maxCount: 1 },
  { name: 'idCardUrl', maxCount: 1 }
]);

module.exports = { uploadFiles };
