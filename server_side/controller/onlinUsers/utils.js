const yup = require('yup');
const dbx = require('../../configs/dropBox');
const { Admin, SuperAdmin, Instructor, Student } = require('../../models/schema/onlineUsers');
const mongoose = require('mongoose');
const fetch = require('isomorphic-fetch'); // Dropbox SDK requires fetch
const { loadTokens, saveTokens, refreshAccessToken } = require('../../configs/dropBox')

// Assuming you have a Mongoose model for the `userIds` collection
const UserId = mongoose.model('UserId', new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}));


// Helper function to generate a unique transaction ID
const generateUniqueTransactionId = async () => {
  const Payment = mongoose.model('Payment');
  let transactionId;

  while (true) {
    transactionId = `TXN${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    const existingTransaction = await Payment.findOne({ transactionId });
    if (!existingTransaction) break; // If unique, exit loop
  }

  return transactionId;
};



const generateUserId = async () => {
  // Find the latest userId from the collection by sorting in descending order
  const lastUserId = await UserId.findOne({}).sort({ userId: -1 });

  let serialNumber = 1; // Default number if no userId exists yet

  if (lastUserId) {
    // Extract the current number from the last userId (e.g., "user/45" -> 45)
    const lastSerialNumber = parseInt(lastUserId.userId.split('/').pop(), 10);

    // Increment the number for the new userId
    serialNumber = lastSerialNumber + 1;
  }

  // Format the new userId as `user/number`, with leading zeros if needed
  const newUserId = `user/${serialNumber}`;

  // Save the new userId in the userIds collection
  const newUserIdEntry = new UserId({ userId: newUserId });
  await newUserIdEntry.save();

  // Return the newly generated userId
  return newUserId;
};



// Function to upload file to Dropbox
const uploadToDropbox = async (file, filePath) => {
  try {
    // Load the current access token
    let accessToken = await loadTokens();
    if (!accessToken) {
      throw new Error('No access token found');
    }

    // Check if the token is still valid or needs to be refreshed
    const tokenExpiry = Date.now();
    if (accessToken.expires_at && accessToken.expires_at < tokenExpiry) {
      console.log('Access token expired, refreshing...');
      
      const refreshedToken = await refreshAccessToken(accessToken.refreshToken);
      accessToken = refreshedToken;
      await saveTokens(refreshedToken);
    }

    // Dropbox API upload endpoint
    const uploadUrl = 'https://content.dropboxapi.com/2/files/upload';
    const headers = {
      'Authorization': `Bearer ${accessToken.access_token}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: filePath,   // Path where the file will be saved in Dropbox
        mode: 'add',      // 'add' to upload new file, 'overwrite' to replace existing files
        autorename: true, // Automatically rename if there's a conflict
      }),
    };

    const fileBuffer = file.buffer || file;

    // Upload the file to Dropbox
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: headers,
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Dropbox upload failed with status: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('File uploaded successfully:', uploadData);

    // Now create a shareable link for the uploaded file
    const shareLinkResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: uploadData.path_lower, // The path of the uploaded file
        settings: {
          requested_visibility: 'public',  // Make it public (optional)
        },
      }),
    });

    if (!shareLinkResponse.ok) {
      throw new Error(`Failed to create shared link: ${shareLinkResponse.status}`);
    }

    const shareData = await shareLinkResponse.json();
    console.log('Shared link created successfully:', shareData);

    // Return the shared link (Dropbox adds a `dl=0` parameter by default)
    const shareableUrl = shareData.url.replace('?dl=0', '?raw=1'); // Convert to direct link if needed
    const directUrl = shareableUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    return directUrl;  // Return the direct link to the uploaded file

  } catch (error) {
    console.error('Error uploading file to Dropbox:', error.message);
    throw error;  // Rethrow the error after logging it
  }
};




// Validation schemas
const userValidationSchemas = {
  admin: yup.object().shape({
    userId: yup.string().optional(),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    idCardUrl: yup.string().url().optional(),
    role: yup.string().required('role is required'),
  }),
  superadmin: yup.object().shape({
    userId: yup.string().optional(),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    idCardUrl: yup.string().url().optional(),
    role: yup.string().required('role is required'),
  }),
  instructor: yup.object().shape({
    userId: yup.string().optional(),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    profilePictureUrl: yup.string().url().optional(),
    idCardUrl: yup.string().url().optional(),
    instructorId: yup.string().optional(),
    program: yup.string().required('Program is required'),
    role: yup.string().required('role is required'),
  }),
  student: yup.object().shape({
    userId: yup.string().optional(),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    profilePictureUrl: yup.string().url().optional(),
    idCardUrl: yup.string().url().optional(),
    program: yup.string().required('Program is required'),
    emergencyContactName: yup.string().required('Emergency contact name is required'),
    emergencyContactRelationship: yup.string().required('Emergency contact relationship is required'),
    emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
    role: yup.string().required('role is required'),
  }),
};

// Map role to the correct Model
const getModelByRole = (role) => {
  switch (role) {
    case 'admin':
      return Admin;
    case 'superadmin':
      return SuperAdmin;
    case 'instructor':
      return Instructor;
    case 'student':
      return Student;
    default:
      throw new Error('Invalid role');
  }
};

// Generate Student ID
const generateStudentId = async (program) => {
  const lastStudent = await Student.findOne({}).sort({ _id: -1 });
  let serialNumber = 1; // Default serial number

  if (lastStudent) {
    const lastStudentId = lastStudent.studentId;
    // Match the format: student/{program}/{serialNumber}
    const match = lastStudentId.match(/student\/([^\/]+)\/(\d+)$/);
    if (match) {
      const lastSerialNumber = parseInt(match[2], 10); // Extract the serial number part
      if (!isNaN(lastSerialNumber)) {
        serialNumber = lastSerialNumber + 1; // Increment the serial number
      }
    }
  }

  return `student/${program}/${String(serialNumber).padStart(2, '0')}`;
};


// Generate Instructor ID
const generateInstructorId = async () => {
  const lastInstructor = await Instructor.findOne({}).sort({ _id: -1 });
  let serialNumber = 1; // Default serial number

  if (lastInstructor) {
    const lastInstructorId = lastInstructor.instructorId;
    // Match the format: instructor/{serialNumber}
    const match = lastInstructorId.match(/instructor\/(\d+)$/);
    if (match) {
      const lastSerialNumber = parseInt(match[1], 10); // Extract the serial number part
      if (!isNaN(lastSerialNumber)) {
        serialNumber = lastSerialNumber + 1; // Increment the serial number
      }
    }
  }

  return `instructor/${String(serialNumber).padStart(2, '0')}`;
};




module.exports = {
  uploadToDropbox,
  generateInstructorId,
  generateStudentId,
  getModelByRole,
  userValidationSchemas,
  generateUserId,
  generateUniqueTransactionId

};
