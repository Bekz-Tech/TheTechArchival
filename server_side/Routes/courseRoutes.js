const express = require('express');
const router = express.Router();
const { addCourse, getCourses, updateCourse, deleteCourse, updateNotificationById } = require('../controller/courseController');  // Adjust path accordingly

// Add a new course
router.post('/api/v1/courses', addCourse);

// Get all courses
router.get('/api/v1/courses', getCourses);

// Update a specific course
router.put('/api/v1/courses/:courseId', updateCourse);

// Delete a specific course
router.delete('/api/v1/courses/:courseId', deleteCourse);

module.exports = router;
