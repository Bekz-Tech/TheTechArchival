const { uploadToDropbox, 
        generateUniqueTransactionId,  
        generateInstructorId, 
        generateStudentId, 
        getModelByRole, 
        userValidationSchemas, 
        generateUserId 
      } = require('./utils');
      
const yup = require('yup');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Course = require('../../models/schema/courseSchema');
const Payment = require('../../models/schema/paymentSchema');
const Chatroom = require('../../models/schema/chatRoom');

// Create user
const createUser = async (req, res) => {
  const { role, program, password, cohort, amountPaid } = req.body;
  const validationSchema = userValidationSchemas[role];

  if (!validationSchema) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    // Validate incoming data
    await validationSchema.validate(req.body, { abortEarly: false });

    req.body.userId = await generateUserId();

    const Model = getModelByRole(role);

    if (role === 'student') {
      req.body.studentId = await generateStudentId(program);
    }

    if (role === 'instructor') {
      req.body.instructorId = await generateInstructorId();
    }

    // Hash the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
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

    // Payment generation for students
    if (role === 'student' && amountPaid) {
      const transactionId = await generateUniqueTransactionId();
      const payment = new Payment({
        userId: newUser._id,
        amount: amountPaid,
        method: "other", // Add logic to capture actual method if needed
        status: "completed",
        transactionId,
      });
      await payment.save();
    }

    // Handle cohorts and chatrooms
    const CourseModel = mongoose.model('Course');
    const ChatroomModel = mongoose.model('Chatroom');

    if (role === 'student') {
      // Add the user to the cohort's students array
      await CourseModel.updateOne(
        { "cohorts.cohortName": cohort },
        { $addToSet: { "cohorts.$.students": newUser.userId, students: newUser.userId } }
      );

      // Add the student to the relevant chatroom
      await ChatroomModel.updateOne(
        { name: cohort },
        { $addToSet: { participants: newUser.userId } }
      );
    } else if (role === 'instructor') {
      // Add the instructor to the cohort
      await CourseModel.updateOne(
        { "cohorts.cohortName": cohort },
        { $set: { "cohorts.$.instructor": newUser.userId } }
      );

      // Add the instructor to the relevant chatroom
      await ChatroomModel.updateOne(
        { name: cohort },
        { $addToSet: { participants: newUser.userId } }
      );
    } else if (role === 'admin' || role === 'superadmin') {
      // Add the user to all chatrooms
      await ChatroomModel.updateMany(
        {},
        { $addToSet: { participants: newUser.userId } }
      );
    }

    // Update Course for Instructor or Student
    if (role === 'instructor') {
      // Add instructor to the course's `instructors` array where program name matches
      await CourseModel.updateOne(
        { courseName: program }, // assuming `program` corresponds to `courseName` in the Course schema
        { $addToSet: { instructors: newUser.userId } }
      );
    } else if (role === 'student') {
      // Add student to the course's `students` array where program name matches
      await CourseModel.updateOne(
        { courseName: program }, // assuming `program` corresponds to `courseName` in the Course schema
        { $addToSet: { students: newUser.userId } }
      );
    }

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
  console.log('called')
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

// Function to update notification by ID
const updateNotificationById = async (req, res) => {
  const { notificationId } = req.params; // Get notification ID from request parameters
  const { message, type, priority, readStatus, actionLink, isDeleted } = req.body; // Get updated data from request body
  
  // Find the notification using the notification ID
  try {
    // Searching in all user types (Admin, SuperAdmin, Instructor, Student)
    const userModels = [Admin, SuperAdmin, Instructor, Student];
    
    for (let model of userModels) {
      const user = await model.findOne({ 'notifications.id': notificationId });

      if (user) {
        // Notification found, now update it
        const notification = user.notifications.id(notificationId); // Access the specific notification by ID

        // Update fields if provided in the request body
        if (message) notification.message = message;
        if (type) notification.type = type;
        if (priority) notification.priority = priority;
        if (readStatus !== undefined) notification.readStatus = readStatus;
        if (actionLink) notification.actionLink = actionLink;
        if (isDeleted !== undefined) notification.isDeleted = isDeleted;

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: 'Notification updated successfully', notification });
      }
    }

    // If notification ID was not found in any user
    return res.status(404).json({ message: 'Notification not found' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  patchUser,
  deleteUser,
  updateNotificationById
};
