const {Cohort} = require('../models/schema/courseSchema'); // Assuming your model is named 'cohort'

// Get all timetable entries for a specific cohort
const getTimetable = async (req, res) => {

  try {
    const { cohortName } = req.params;
    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    res.status(200).json(cohort.timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable', error });
  }
};

// Add a new timetable entry to a specific cohort
const addTimetableEntry = async (req, res) => {
  try {
    const { cohortName } = req.params;
    console.log('Cohort Name:', cohortName); // Check if this prints correctly

    const newEntry = req.body;
    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    
    cohort.timetable.push(newEntry);
    await cohort.save();
    
    res.status(201).json({ message: 'Timetable entry added successfully', timetable: cohort.timetable });
  } catch (error) {
    res.status(500).json({ message: 'Error adding timetable entry', error });
  }
};


// Update an existing timetable entry by its ID
const updateTimetableEntry = async (req, res) => {
  try {
    const { cohortName, entryId } = req.params;
    const updatedEntry = req.body; // Expect the updated timetable entry details in req.body

    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    const timetableIndex = cohort.timetable.findIndex(entry => entry.id.toString() === entryId);
    if (timetableIndex === -1) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    cohort.timetable[timetableIndex] = { ...cohort.timetable[timetableIndex].toObject(), ...updatedEntry };
    await cohort.save(); // Save changes

    res.status(200).json({ message: 'Timetable entry updated successfully', timetable: cohort.timetable });
  } catch (error) {
    res.status(500).json({ message: 'Error updating timetable entry', error });
  }
};

// Delete a timetable entry by its ID
const deleteTimetableEntry = async (req, res) => {
  try {
    const { cohortName, entryId } = req.params;

    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    const updatedTimetable = cohort.timetable.filter(entry => entry.id.toString() !== entryId);
    
    if (updatedTimetable.length === cohort.timetable.length) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    cohort.timetable = updatedTimetable;
    await cohort.save(); // Save changes

    res.status(200).json({ message: 'Timetable entry deleted successfully', timetable: cohort.timetable });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable entry', error });
  }
};

module.exports = {
  getTimetable,
  addTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
};