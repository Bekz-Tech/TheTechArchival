const Course = require('../../models/schema/courseSchema');
const Chatroom = require('../../models/schema/chatRoom');

// Add Cohort
const addCohort = async (req, res) => {
  const { courseName, cohortName, instructor, timetable } = req.body;

  try {
    // Find the course by courseName
    const course = await Course.findOne({ courseName });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create the new cohort
    const newCohort = {
      cohortName,
      instructor,
      timetable,
    };

    // Add the cohort to the course
    course.cohorts.push(newCohort);
    await course.save();

    // Create a chatroom for the cohort
    const newChatroom = new Chatroom({
      name: cohortName,
      participants: [instructor], // Initially add the instructor
    });
    await newChatroom.save();

    return res.status(201).json({ message: 'Cohort added successfully', cohort: newCohort });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding cohort', error: error.message });
  }
};

// Remove Cohort
const removeCohort = async (req, res) => {
    const { courseName, cohortName } = req.body;
  
    try {
      // Find the course by courseName
      const course = await Course.findOne({ courseName });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Remove the cohort from the course
      const updatedCohorts = course.cohorts.filter(cohort => cohort.cohortName !== cohortName);
      course.cohorts = updatedCohorts;
  
      // Remove the corresponding chatroom
      await Chatroom.deleteOne({ name: cohortName });
  
      await course.save();
  
      return res.status(200).json({ message: 'Cohort removed successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error removing cohort', error: error.message });
    }
  };

  // Edit Cohort
const editCohort = async (req, res) => {
    const { courseName, cohortName, updatedDetails } = req.body;
  
    try {
      // Find the course by courseName
      const course = await Course.findOne({ courseName });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Find the cohort to update
      const cohortIndex = course.cohorts.findIndex(cohort => cohort.cohortName === cohortName);
      if (cohortIndex === -1) {
        return res.status(404).json({ message: 'Cohort not found' });
      }
  
      // Update the cohort
      const updatedCohort = { ...course.cohorts[cohortIndex], ...updatedDetails };
      course.cohorts[cohortIndex] = updatedCohort;
  
      // If instructor is changed, update the chatroom participants
      if (updatedDetails.instructor) {
        await Chatroom.updateOne(
          { name: cohortName },
          { $set: { participants: [updatedDetails.instructor] } }
        );
      }
  
      await course.save();
  
      return res.status(200).json({ message: 'Cohort updated successfully', cohort: updatedCohort });
    } catch (error) {
      return res.status(500).json({ message: 'Error editing cohort', error: error.message });
    }
  };
  

  // Get Cohorts
const getCohorts = async (req, res) => {
    const { courseName } = req.query;
  
    try {
      // Find the course by courseName
      const course = await Course.findOne({ courseName });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      return res.status(200).json({ cohorts: course.cohorts });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching cohorts', error: error.message });
    }
  };
  
