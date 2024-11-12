const{
  uploadToDropbox,
  generateInstructorId,
  generateStudentId,
  getModelByRole,
  userValidationSchemas
} = require('./utils')
const yup = require('yup');
const bcrypt = require('bcryptjs');

// Create user
const createUser = async (req, res) => {
  const { role, program, password } = req.body;
  const validationSchema = userValidationSchemas[role];

  if (!validationSchema) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    // Validate incoming data
    await validationSchema.validate(req.body, { abortEarly: false });

    const Model = getModelByRole(role);

    if (role === 'student') {
      req.body.studentId = await generateStudentId(program);
    }

    if (role === 'instructor') {
      req.body.instructorId = await generateInstructorId();
    }

    // Hash the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash with a salt of 10 rounds
      req.body.password = hashedPassword;
    }

    // Upload profilePicture and idCardUrl to Dropbox (if provided)
    if (req.files) {
      if (req.files.profilePicture) {
        const profilePicture = req.files.profilePicture[0];
        req.body.profilePicture = await uploadToDropbox(profilePicture, `profilePictures/${profilePicture.originalname}`);
      }

      if (req.files.idCardUrl) {
        const idCard = req.files.idCardUrl[0];
        req.body.idCardUrl = await uploadToDropbox(idCard, `idCards/${idCard.originalname}`);
      }
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
  try {
    // Fetch all users from each role
    const adminModel = getModelByRole('admin');
    const superAdminModel = getModelByRole('superadmin');
    const instructorModel = getModelByRole('instructor');
    const studentModel = getModelByRole('student');

    const admins = await adminModel.find();
    const superAdmins = await superAdminModel.find();
    const instructors = await instructorModel.find();
    const students = await studentModel.find();

    // Return an object containing arrays of users for each role
    if(admins && superAdmins && instructors && students){

      return res.status(200).json({
        admins,
        superAdmins,
        instructors,
        students
      });
    }
  
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
// Update user (full update)
const updateUser = async (req, res) => {
  const { userId, role, password } = req.body;

  try {
    const Model = getModelByRole(role);

    // Hash the password if it's being updated
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
    }

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
  const { userId, role, password } = req.body;

  try {
    const Model = getModelByRole(role);

    // Hash the password if it's being updated
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
    }

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
