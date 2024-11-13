// controller/courseController.js
const Course = require('../models/schema/courseSchema');

// Controller to create a new course
exports.createCourse = async (req, res) => {
  try {
    const {
      assignments,
      cohorts,
      cost,
      courseId,
      courseName,
      createdAt,
      description,
      duration,
      startDate,
    } = req.body;

    // Check if courseId already exists
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course ID already exists' });
    }

    const newCourse = new Course({
      assignments,
      cohorts,
      cost,
      courseId,
      courseName,
      createdAt,
      description,
      duration,
      startDate,
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create course', error });
  }
};

// Controller to get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
};

// Controller to get a course by courseId
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch course', error });
  }
};

// Controller to update course details
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      assignments,
      cohorts,
      cost,
      courseName,
      createdAt,
      description,
      duration,
      startDate,
    } = req.body;

    const course = await Course.findOneAndUpdate(
      { courseId },
      {
        assignments,
        cohorts,
        cost,
        courseName,
        createdAt,
        description,
        duration,
        startDate,
      },
      { new: true }  // Return the updated course
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update course', error });
  }
};

// Controller to delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOneAndDelete({ courseId });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete course', error });
  }
};