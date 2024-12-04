const express = require('express');
const router = express.Router();
const { addCourse, getCourses, updateCourse, deleteCourse } = require('../controller/courseController');  // Adjust path accordingly
const { addCohort, getAllCohorts, getCohort, deleteCohort, updateCohort } = require('../controller/cohorts');

// Route to add a new cohort to a course
router.post('/api/v1/:courseId/cohorts', addCohort);

// Route to get all cohorts for a specific course
router.get('/api/v1/:courseId/cohorts', getAllCohorts);

// Route to get a single cohort from a course
router.get('/api/v1/:courseId/cohorts/:cohortId', getCohort);

// Route to delete a specific cohort from a course
router.delete('/api/v1/:courseId/cohorts/:cohortId', deleteCohort);

// Route to update a specific cohort within a course
router.put('/api/v1/:courseId/cohorts/:cohortId', updateCohort);
// Add a new course
router.post('/api/v1/courses', addCourse);

// Get all courses
router.get('/api/v1/courses', getCourses);

// Update a specific course
router.put('/api/v1/courses/:courseId', updateCourse);

// Delete a specific course
router.delete('/api/v1/courses/:courseId', deleteCourse);

module.exports = router;
