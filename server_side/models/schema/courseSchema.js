const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true, // Ensures courseId is unique
  },
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date if not provided
  },
  cost: {
    type: Number,
    required: true,
  },
  curriculum: {
    type: [
      {
        topic: {
          type: String,
          required: true,
        },
        overview: {
          type: String,
          required: true,
        },
        week: {
          type: String,
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: false, // Default to false, since it’s not completed initially
        },
      },
    ],
    default: [],
  },
  assignments: {
    type: [String], // Array of assignment names or IDs
    default: [],    // Default to an empty array
  },
  cohorts: {
    type: [String], // Array of cohort names or IDs
    default: [],    // Default to an empty array
  },
});

// Create the model from the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
