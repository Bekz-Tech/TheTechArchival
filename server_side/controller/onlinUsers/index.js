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
if (role === 'student') {
// Add the user to the course's students array
await Course.updateOne(
  { courseName: program },
  { $addToSet: { students: newUser.userId } }
);

// Add the user to the chatroom where cohort name matches
await Chatroom.updateOne(
  { name: cohort },
  { $addToSet: { participants: newUser.userId } }
);

// Add the user to the cohort's students array
await Course.updateOne(
  { 'cohorts.cohortName': cohort },
  { $addToSet: { 'cohorts.$.students': newUser.userId } }
);
} else if (role === 'instructor') {
// Replace instructor in the cohort and add to instructors array
await Course.updateOne(
  { 'cohorts.cohortName': cohort },
  { $set: { 'cohorts.$.instructor': newUser.userId } }
);

// Add instructor to the course's instructors array
await Course.updateOne(
  { courseName: program },
  { $addToSet: { instructors: newUser.userId } }
);

// Add the instructor to the chatroom where cohort name matches
await Chatroom.updateOne(
  { name: cohort },
  { $addToSet: { participants: newUser.userId } }
);
} else if (role === 'admin' || role === 'superadmin') {
// Add the admin or superadmin to all chatrooms
await Chatroom.updateMany(
  {},
  { $addToSet: { participants: newUser.userId } }
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
console.log('called');
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
return res.status(200).json({
admins,
superAdmins,
instructors,
students
});
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
// Delete user and remove from all rooms and related fields
const deleteUser = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const Model = getModelByRole(role);

    // Step 1: Find the user and remove them from their role collection (Admin, Student, Instructor, etc.)
    const userToDelete = await Model.findOneAndDelete({ userId });

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Remove user from courses (if they are a student or instructor)
    if (role === 'student') {
      // Remove the student from the relevant courses and cohorts
      await Course.updateMany(
        { students: userId },
        { $pull: { students: userId } }
      );

      // Remove the student from the cohorts they belong to
      await Course.updateMany(
        { 'cohorts.students': userId },
        { $pull: { 'cohorts.$.students': userId } }
      );

    } else if (role === 'instructor') {
      // Remove the instructor from the relevant courses and cohorts
      await Course.updateMany(
        { instructors: userId },
        { $pull: { instructors: userId } }
      );

      // Remove the instructor from the cohort's instructor field
      await Course.updateMany(
        { 'cohorts.instructor': userId },
        { $pull: { 'cohorts.$.instructor': userId } }
      );
    }

    // Step 3: Remove the user from all chatrooms
    await Chatroom.updateMany(
      { participants: userId },
      { $pull: { participants: userId } }
    );

    // Step 4: Optionally, delete user-specific notifications (if needed)
    // If you are storing user-specific notifications, you can also remove those
    await Model.updateMany(
      { userId },
      { $pull: { notifications: { userId } } }
    );

    // Step 5: Return a success response
    return res.status(200).json({ message: 'User deleted successfully and removed from all related rooms and fields' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user and removing them from related fields', error: error.message });
  }
};


// Backend logic to update a notification by ID
const updateNotificationById = async (req, res) => {
const { notificationId } = req.params; // Get notification ID from request parameters
const { userId, role, message, type, priority, readStatus, actionLink, isDeleted } = req.body; // Get updated data from request body

// Validate required parameters
if (!userId || !role || !notificationId) {
return res.status(400).json({ message: 'userId, role, and notificationId are required' });
}

try {
// Get the correct model based on the role (admin, instructor, etc.)
const Model = getModelByRole(role);

// Find the user by userId
const user = await Model.findOne({ userId });

if (!user) {
return res.status(404).json({ message: 'User not found' });
}

// Find the specific notification within the user's notifications array
const notification = user.notifications.find(n => n.id === notificationId);

if (!notification) {
return res.status(404).json({ message: 'Notification not found' });
}

// Update the notification fields if provided in the request body
notification.message = message || notification.message;
notification.type = type || notification.type;
notification.priority = priority || notification.priority;
notification.readStatus = readStatus || notification.readStatus;
notification.actionLink = actionLink || notification.actionLink;
notification.isDeleted = isDeleted || notification.isDeleted;

// Save the updated user document with the modified notification
await user.save();

return res.status(200).json({ message: 'Notification updated successfully', notification });
} catch (error) {
return res.status(500).json({ message: 'Error updating notification', error: error.message });
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
