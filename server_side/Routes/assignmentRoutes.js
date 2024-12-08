const express = require('express');
const router = express.Router();
const {
  postAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignment,
  addSubmission,
  getAllAssignments
} = require('../controller/assignmentController');

// Assignment routes
router.get('/:cohortName/assignments', getAllAssignments);
router.post('/:cohortName/assignments', postAssignment);
router.put('/:cohortName/assignments/:assignmentId', updateAssignment);
router.delete('/:cohortName/assignments/:assignmentId', deleteAssignment);
router.get('/:cohortName/assignments/:assignmentId', getAssignment);
router.patch('/:cohortName/assignments/:assignmentId/submissions', addSubmission);

module.exports = router;
