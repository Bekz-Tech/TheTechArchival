const express = require('express');
const router = express.Router();
const userController = require('../controller/onlineUsers'); // Import the controller functions

// Route for creating a user
router.post('/api/v1/user', userController.createUser);

// Route for getting users based on role
router.get('/api/v1/user', userController.getUsers);

// Route for updating a user's details (full update)
router.put('/api/v1/user', userController.updateUser);

// Route for patching a user's details (partial update)
router.patch('/api/v1/user', userController.patchUser);

// Route for deleting a user
router.delete('/api/v1/user', userController.deleteUser);

module.exports = router;
