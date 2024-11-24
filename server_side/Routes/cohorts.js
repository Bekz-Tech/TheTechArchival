const Course = require('../models/schema/courseSchema'); // Assuming the Course model is in 'models/courseModel.js'

// Add a new cohort to a course
exports.addCohort = async (req, res) => {
  try {
    const { courseId } = req.params; // The course ID from request parameters
    const cohortData = req.body; // Cohort data from the request body

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Push the new cohort to the course's cohorts array
    course.cohorts.push(cohortData);

    await course.save();
    res.status(201).json({ message: 'Cohort added successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding cohort', error });
  }
};


// Get all cohorts for a course
exports.getCohorts = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Return the cohorts array
      res.status(200).json({ cohorts: course.cohorts });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cohorts', error });
    }
  };

  
  // Delete a cohort from a course
exports.deleteCohort = async (req, res) => {
    try {
      const { courseId, cohortId } = req.params;
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Remove the cohort by filtering out the one with the given cohortId
      course.cohorts = course.cohorts.filter(cohort => cohort._id.toString() !== cohortId);
  
      await course.save();
      res.status(200).json({ message: 'Cohort deleted successfully', course });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting cohort', error });
    }
  };
  

// Update a specific cohort within a course
exports.updateCohort = async (req, res) => {
    try {
      const { courseId, cohortId } = req.params;
      const updatedCohortData = req.body; // Data to update the cohort
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Find the cohort by its _id and update it
      const cohortIndex = course.cohorts.findIndex(cohort => cohort._id.toString() === cohortId);
      if (cohortIndex === -1) {
        return res.status(404).json({ message: 'Cohort not found' });
      }
  
      // Update the cohort
      course.cohorts[cohortIndex] = { ...course.cohorts[cohortIndex]._doc, ...updatedCohortData };
  
      await course.save();
      res.status(200).json({ message: 'Cohort updated successfully', course });
    } catch (error) {
      res.status(500).json({ message: 'Error updating cohort', error });
    }
  };
  