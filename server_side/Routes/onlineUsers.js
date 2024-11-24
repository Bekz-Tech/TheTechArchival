const express = require('express');
const router = express.Router();
const userController = require('../controller/onlinUsers'); // Import the controller functions
const { uploadImages } = require('../middleware/uploadImages')

// Route for creating a user
router.post('/api/v1/user', uploadImages, userController.createUser);

// Route for getting users based on role
router.get('/api/v1/users',  userController.getUsers);

// Route for updating a user's details (full update)
router.put('/api/v1/user', uploadImages, userController.updateUser);

// Route for patching a user's details (partial update)
router.patch('/api/v1/user', uploadImages, userController.patchUser);

// Route for deleting a user
router.delete('/api/v1/user', userController.deleteUser);

router.patch('/notification/:notificationId', userController.updateNotificationById);

module.exports = router;
