const express = require('express');
const router = express.Router();
const {
  getTimetable,
  addTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} = require('../controller/timeTableController'); // Adjust the path to your actual controller

// Route to get all timetable entries for a specific cohort
router.get('/:cohortName/timetable', getTimetable);

// Route to add a new timetable entry to a specific cohort
router.post('/:cohortName/timetable', addTimetableEntry);

// Route to update an existing timetable entry by its ID
router.put('/:cohortName/timetable/:entryId', updateTimetableEntry);

// Route to delete a timetable entry by its ID
router.delete('/:cohortName/timetable/:entryId', deleteTimetableEntry);

module.exports = router;
