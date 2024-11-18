const { Course } = require('../models/schema/courseSchema');

// Controller to create a new course
const createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body); // Assuming course data is in the request body
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course', error });
  }
};

// Controller to get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to get a single course by courseId
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params; // courseId from URL params
    const course = await Course.find({ courseId });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to update a course by courseId
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updatedCourse = await Course.findOneAndUpdate({ courseId }, req.body, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error });
  }
};

// Controller to delete a course by courseId
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const deletedCourse = await Course.findOneAndDelete({ courseId });

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
};

// Controller to add a cohort to the cohorts array by courseId
const addCohort = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { cohort } = req.body; // Assuming cohort is passed in the request body

    const course = await Course.find({ courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Add the new cohort to the cohorts array if it's not already there
    if (!course.cohorts.includes(cohort)) {
      course.cohorts.push(cohort); // Push cohort to the array
    }

    const updatedCourse = await course.save();

    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error adding cohort', error });
  }
};


module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  addCohort,
  deleteCourse
};
