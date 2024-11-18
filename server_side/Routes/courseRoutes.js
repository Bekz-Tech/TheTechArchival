// routes/courseRoutes.js
const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addCohort
} = require('../controller/courseController');

const router = express.Router();

// Route to create a course
router.post('/api/v1/courses', createCourse);

// Route to get all courses
router.get('/api/v1/courses', getCourses);

// Route to get a course by ID
router.get('/api/v1/courses/:courseId', getCourseById);

// Route to update a course by ID
router.put('/api/v1/courses/:courseId', updateCourse);

// Route to delete a course by ID
router.delete('/api/v1/courses/:courseId', deleteCourse);
router.patch('api/v1/courses/:courseId/cohorts', addCohort);

module.exports = router;