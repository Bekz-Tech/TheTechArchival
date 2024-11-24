const mongoose = require("mongoose");
const { Schema } = mongoose; // Destructure Schema from mongoose

// Assignment Schema
const assignmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  submissions: [String], // Array of submission IDs or file links
}, { _id: true }); // Auto-generate _id

// Timetable Schema
const timetableSchema = new Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  topic: { type: String, required: true },
  done: { type: Boolean, default: false }, // Default to false
}, { _id: true }); // Auto-generate _id

// Cohort Schema
const cohortSchema = new Schema({
  cohortName: { type: String, required: true },
  instructor: { type: String, required: true },
  assignments: { type: [assignmentSchema], default: [] }, // Array of assignments
  students: { type: [String], default: [] }, // List of student IDs
  timetable: { type: [timetableSchema], default: [] }, // Array of timetable objects
}, { timestamps: true });

// Course Schema
const courseSchema = new Schema({
  courseName: { type: String, required: true },
  courseId: { type: String, required: true, unique: true }, // Add courseId field
  cost: { type: Number, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  cohorts: { type: [cohortSchema], default: [] }, // Array of cohort objects
  instructors: { type: [String], default: [] }, // Array of instructor IDs
  curriculum: { type: [String], default: [] }, // Curriculum topics
  students: { type: [String], default: [] }, // List of student IDs
}, { timestamps: true });

// Models Export
const Course = mongoose.model("Course", courseSchema);

module.exports = { assignmentSchema, Course };
