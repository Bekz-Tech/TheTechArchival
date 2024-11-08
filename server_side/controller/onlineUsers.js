const { Admin, SuperAdmin, Instructor, Student } = require('../models/schema/onlineUsers');
const yup = require('yup');

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

// Generate Student ID
const generateInstructorId = async () => {
  const lastInstructor = await Instructor.findOne({}).sort({ _id: -1 });
  let serialNumber = '01'; // Default serial number

  if (lastInstructor) {
    const lastInstructorId = lastInstructor.instructorId;
    const lastSerialNumber = parseInt(lastInstructorId.split('/').pop(), 10); // Extract serial number
    serialNumber = String(lastSerialNumber + 1).padStart(2, '0'); // Increment and format with leading zeros
  }

  return `student/${program}/${serialNumber}`;
};

// Create user
const createUser = async (req, res) => {
  const { role, program } = req.body;

  const validationSchema = userValidationSchemas[role];
  if (!validationSchema) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    // Validate incoming data
    await validationSchema.validate(req.body, { abortEarly: false });

    const Model = getModelByRole(role);

    if (role === 'student') {
      // Generate Student ID before creating the student
      req.body.studentId = await generateStudentId(program);
    }

    if (role === 'instructor') {
      // Generate Student ID before creating the student
      req.body.studentId = await generateInstructorId();
    }

    // Create the user in the database
    const newUser = new Model(req.body);
    await newUser.save();

    return res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', details: error.errors });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users by role
const getUsers = async (req, res) => {
  const { role } = req.query;

  try {
    const Model = getModelByRole(role);
    const users = await Model.find(); // Retrieve all users for the given role
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user (full update)
const updateUser = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const Model = getModelByRole(role);
    const updatedUser = await Model.findOneAndUpdate({ userId }, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Patch user (partial update)
const patchUser = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const Model = getModelByRole(role);
    const updatedUser = await Model.findOneAndUpdate({ userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User patched successfully', user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error patching user', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const Model = getModelByRole(role);
    const deletedUser = await Model.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  patchUser,
  deleteUser,
};
