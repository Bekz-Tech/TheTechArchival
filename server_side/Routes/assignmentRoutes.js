const express = require('express');
const router = express.Router();
const {
  addAssignmentToInstructors,
  getAssignmentsForCourse,
  updateAssignment,
  deleteAssignment
} = require('../controller/assignmentController');

// Route to add an assignment to an instructor
router.post('/api/v1/add', async (req, res) => {
  const { assignment, userId, courseId } = req.body;
  try {
    const newAssignment = await addAssignmentToInstructors(assignment, userId, courseId);
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all assignments for a specific course
router.get('/course/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const assignments = await getAssignmentsForCourse(userId, courseId);
    res.status(200).json(assignments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to update an assignment
router.put('/update/:userId/:courseId/:assignmentId', async (req, res) => {
  const { userId, courseId, assignmentId } = req.params;
  const updatedAssignment = req.body;
  try {
    const updated = await updateAssignment(userId, courseId, assignmentId, updatedAssignment);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to delete an assignment
router.delete('/delete/:userId/:courseId/:assignmentId', async (req, res) => {
  const { userId, courseId, assignmentId } = req.params;
  try {
    const result = await deleteAssignment(userId, courseId, assignmentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
