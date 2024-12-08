const { Cohort} = require('../models/schema/courseSchema');

// POST: Add new assignment
const postAssignment = async (req, res) => {
  try {
    const { cohortName } = req.params;
    const { title, description, dueDate } = req.body;

    // Find the cohort by ID
    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Add new assignment
    const newAssignment = {
      title,
      description,
      dueDate,
      submissions: []
    };

    cohort.assignments.push(newAssignment);
    await cohort.save();

    res.status(201).json(cohort.assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PUT: Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { cohortName, assignmentId } = req.params;
    const { title, description, dueDate } = req.body;

    // Find cohort by ID
    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Find assignment in the cohort
    const assignment = cohort.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update assignment fields
    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;

    await cohort.save();
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE: Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { cohortName, assignmentId } = req.params;
    console.log({ cohortName, assignmentId });

    // Find cohort by ID (Ensure this matches your field name)
    const cohort = await Cohort.findOne({ cohortName: cohortName });
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Remove assignment by ID
    const assignmentIndex = cohort.assignments.findIndex(
      (assignment) => assignment._id.toString() === assignmentId
    );
    
    if (assignmentIndex === -1) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Remove the assignment from the array
    cohort.assignments.splice(assignmentIndex, 1);

    // Save the updated cohort
    await cohort.save();

    res.status(200).json({ message: 'Assignment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// GET: Get assignment by ID
const getAssignment = async (req, res) => {
  try {
    const { cohortName, assignmentId } = req.params;

    // Find cohort by ID
    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Find assignment by ID
    const assignment = cohort.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// PATCH: Add student submission to assignment
const addSubmission = async (req, res) => {
  try {
    const { cohortName, assignmentId } = req.params;
    const { studentId, submission } = req.body; // Student ID and their submission details

    // Find cohort by ID
    const cohort = await Cohort.findOne({ cohortName: cohortName }); // Ensure this matches your field name
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Find assignment by ID
    const assignment = cohort.assignments.id(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Push the student submission
    assignment.submissions.push({ studentId, submission });

    await cohort.save();
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// GET: Get all assignments for a specific cohort
const getAllAssignments = async (req, res) => {
  try {
    const { cohortName } = req.params;
    // Find cohort by cohortName
    const cohort = await Cohort.findOne({ cohortName: { $regex: new RegExp(cohortName, 'i') } });
    console.log(cohortName)
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Return all assignments
    res.status(200).json(cohort.assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  postAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignment,
  addSubmission,
  getAllAssignments, // Export the new function
}

