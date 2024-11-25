const {Course} = require('../models/schema/courseSchema');  // Adjust the path based on your folder structure

// Function to generate a unique courseId
async function generateCourseId(courseName) {
  const baseCourseId = `${courseName.replace(/\s+/g, '')}`; // Remove spaces in courseName
  let randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit number
  let courseId = baseCourseId + randomNumber;

  // Check if the generated courseId already exists in the database
  const existingCourse = await Course.findOne({ courseId });

  // If the courseId exists, generate a new one and try again
  while (existingCourse) {
    randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate new 5-digit number
    courseId = baseCourseId + randomNumber;
    existingCourse = await Course.findOne({ courseId });
  }

  return courseId;
}

// Controller function to create a new course
async function addCourse(req, res) {
  try {
    const { courseName, cost, duration, description, startDate, instructors, curriculum, students } = req.body;

    // Generate a unique courseId
    const courseId = await generateCourseId(courseName);

    // Create a new course with the generated courseId
    const newCourse = new Course({
      courseName,
      courseId,
      cost,
      duration,
      description,
      startDate,
      instructors,
      curriculum,
      students,
    });

    // Save the course to the database
    await newCourse.save();

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find();

    return res.status(200).json({
      message: 'Courses fetched successfully',
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const updatedDetails = req.body;

  try {
    // Find the course by courseId and update it
    const course = await Course.findByIdAndUpdate(courseId, updatedDetails, { new: true });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating course',
      error: error.message,
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    // Find the course by courseId and delete it
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting course',
      error: error.message,
    });
  }
};

module.exports = {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};
