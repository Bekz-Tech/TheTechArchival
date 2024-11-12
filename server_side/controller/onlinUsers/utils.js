const yup = require('yup');
const dbx = require('../../configs/dropBox');
const { Admin, SuperAdmin, Instructor, Student } = require('../../models/schema/onlineUsers');
const mongoose = require('mongoose');

// Assuming you have a Mongoose model for the `userIds` collection
const UserId = mongoose.model('UserId', new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}));

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
const uploadToDropbox = async (file, path) => {
  try {
    const response = await dbx.filesUpload({
      path: `/${path}`, // e.g., '/profilePictures/picture123.jpg'
      contents: file.buffer, // Use buffer from multer's in-memory storage
    });

    // Get a public link for the file
    const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: response.result.path_lower
    });

    return linkResponse.result.url.replace('dl=0', 'raw=1'); // Make direct link
  } catch (error) {
    console.error("Error uploading to Dropbox:", error);
    throw new Error('Failed to upload file to Dropbox');
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
    instructorId: yup.string().required('Instructor ID is required'),
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
  let serialNumber = '01'; // Default serial number

  if (lastStudent) {
    const lastStudentId = lastStudent.studentId;
    const lastSerialNumber = parseInt(lastStudentId.split('/').pop(), 10); // Extract serial number
    serialNumber = String(lastSerialNumber + 1).padStart(2, '0'); // Increment and format with leading zeros
  }

  return `student/${program}/${serialNumber}`;
};

// Generate Instructor ID
const generateInstructorId = async () => {
  const lastInstructor = await Instructor.findOne({}).sort({ _id: -1 });
  let serialNumber = '01'; // Default serial number

  if (lastInstructor) {
    const lastInstructorId = lastInstructor.instructorId;
    const lastSerialNumber = parseInt(lastInstructorId.split('/').pop(), 10); // Extract serial number
    serialNumber = String(lastSerialNumber + 1).padStart(2, '0'); // Increment and format with leading zeros
  }

  return `instructor/${serialNumber}`;
};



module.exports = {
  uploadToDropbox,
  generateInstructorId,
  generateStudentId,
  getModelByRole,
  userValidationSchemas,
  generateUserId

};
