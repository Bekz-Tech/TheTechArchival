const mongoose = require('mongoose');
const Instructor = require('../models/schema/onlineUsers').InstructorSchema;

// Add Assignment to Instructor
const addAssignmentToInstructors = async (assignment, userId, courseId) => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID or Course ID is required to update assignment.');
    }

    // Find the instructor by userId with the 'instructor' role
    const instructor = await Instructor.findOne({ userId, role: 'instructor' });
    if (!instructor) {
      throw new Error(`Instructor with userId ${userId} not found.`);
    }

    // Find the specified course within the instructor's courses
    const course = instructor.courses.find(course => course.courseId === courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found for this instructor.`);
    }

    // Create a new assignment entry
    const newAssignment = {
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      courseId,
      courseName: course.courseName,
      createdBy: instructor._id,
      createdAt: new Date().toISOString(),
      submissions: []
    };

    // Add the new assignment to the course's assignments array
    course.assignments.push(newAssignment);

    // Save the updated instructor document
    await instructor.save();

    console.log(`Assignment added to instructor ${instructor._id} successfully`);
    return newAssignment;
  } catch (error) {
    console.error('Error adding assignment to instructor:', error);
    throw error;
  }
};

// Get All Assignments for a Specific Course
const getAssignmentsForCourse = async (userId, courseId) => {
  try {
    const instructor = await Instructor.findOne({ userId, role: 'instructor' });
    if (!instructor) {
      throw new Error(`Instructor with userId ${userId} not found.`);
    }

    const course = instructor.courses.find(course => course.courseId === courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found for this instructor.`);
    }

    return course.assignments;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

// Update an Assignment
const updateAssignment = async (userId, courseId, assignmentId, updatedAssignment) => {
  try {
    const instructor = await Instructor.findOne({ userId, role: 'instructor' });
    if (!instructor) {
      throw new Error(`Instructor with userId ${userId} not found.`);
    }

    const course = instructor.courses.find(course => course.courseId === courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found for this instructor.`);
    }

    const assignment = course.assignments.id(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found.`);
    }

    // Update the assignment properties
    Object.assign(assignment, updatedAssignment);

    // Save the updated instructor document
    await instructor.save();

    console.log(`Assignment with ID ${assignmentId} updated successfully`);
    return assignment;
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};

// Delete an Assignment
const deleteAssignment = async (userId, courseId, assignmentId) => {
  try {
    const instructor = await Instructor.findOne({ userId, role: 'instructor' });
    if (!instructor) {
      throw new Error(`Instructor with userId ${userId} not found.`);
    }

    const course = instructor.courses.find(course => course.courseId === courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found for this instructor.`);
    }

    // Remove the assignment by ID
    course.assignments = course.assignments.filter(
      assignment => assignment._id.toString() !== assignmentId
    );

    // Save the updated instructor document
    await instructor.save();

    console.log(`Assignment with ID ${assignmentId} deleted successfully`);
    return { message: "Assignment deleted successfully" };
  } catch (error) {
    console.error('Error deleting assignment:', error);
    throw error;
  }
};

module.exports = { 
  addAssignmentToInstructors,
  getAssignmentsForCourse,
  updateAssignment,
  deleteAssignment 
};
