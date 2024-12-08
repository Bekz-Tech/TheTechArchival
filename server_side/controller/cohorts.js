const { Course, Cohort } = require('../models/schema/courseSchema'); // Assuming the Course model is in 'models/courseSchema.js'
const Chatroom = require('../models/schema/chatRoom'); // Assuming the Chatroom model is in 'models/chatroomSchema.js'

// Add a new cohort to a course and automatically create a chatroom
const addCohort = async (req, res) => {
  try {
    const { courseId } = req.params; // The course ID from request parameters
    const cohortData = req.body; // Cohort data from the request body

    // Find the course by the custom courseId field (not _id)
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a new cohort document
    const newCohort = new Cohort({
      courseId,
      cohortName: cohortData.name,  // Assign cohort name
      instructor: '', // Assign the instructor
      assignments: [],  // Default assignments to empty array
      students: [],  // Default students to empty array
      timetable: [],  // Default timetable to empty array
    });

    // Save the new cohort to the database
    await newCohort.save();

    // Create the chatroom for the cohort
    const newChatroom = new Chatroom({
      name: cohortData.name, // Set the chatroom name to the cohort name
      participants: [cohortData.instructorId], // Add the instructor to the chatroom
    });

    // Save the new chatroom to the database
    await newChatroom.save();

    // Add the newly created cohort's _id to the course's cohorts array
    course.cohorts.push(newCohort.id);

    // Save the updated course with the new cohort
    await course.save();

    // Return success response with the created chatroom and cohort
    res.status(201).json({
      message: 'Cohort added successfully, and chatroom created',
      course,
      cohort: newCohort,
      chatroom: newChatroom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding cohort and creating chatroom', error });
  }
};

// Get all cohorts for a course
const getAllCohorts = async (req, res) => {
  console.log('called')
  try {
    const { courseId } = req.params;

    // Find all cohorts associated with the courseId
    const cohorts = await Cohort.find({ courseId });
    if (!cohorts || cohorts.length === 0) {
      return res.status(404).json({ message: 'No cohorts found for this course' });
    }

    // Return the cohorts array for the course
    res.status(200).json({ cohorts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cohorts', error });
  }
};

// Get a single cohort from a course
const getCohort = async (req, res) => {
  try {
    const { courseId, cohortId } = req.params;

    // Find the cohort by its id and courseId
    const cohort = await Cohort.findOne({ courseId, _id: cohortId });
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    res.status(200).json({ cohort });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cohort', error });
  }
};

// Delete a cohort from a course
const deleteCohort = async (req, res) => {
  try {
    const { courseId, cohortId } = req.params;

    // Find and delete the cohort by its courseId and cohortId
    const cohort = await Cohort.findOneAndDelete({ courseId, _id: cohortId });
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Remove the cohort's _id from the course's cohorts array
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.cohorts = course.cohorts.filter(id => id.toString() !== cohortId);
    await course.save();

    res.status(200).json({ message: 'Cohort deleted successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cohort', error });
  }
};

// Update a specific cohort within a course
const updateCohort = async (req, res) => {
  try {
    const { courseId, cohortId } = req.params;
    const updatedCohortData = req.body; // Data to update the cohort

    // Find the cohort by its courseId and cohortId
    const cohort = await Cohort.findOne({ courseId, _id: cohortId });
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    // Update the cohort with the new data
    Object.assign(cohort, updatedCohortData);
    await cohort.save();

    res.status(200).json({ message: 'Cohort updated successfully', cohort });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cohort', error });
  }
};

// Exporting controller functions for destructured import
module.exports = {
  addCohort,
  getAllCohorts,
  getCohort,
  deleteCohort,
  updateCohort
};
