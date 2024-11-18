const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Assignment Schema
const assignmentSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },  // Reference to Course
  createdBy: { type: Schema.Types.ObjectId, ref: "Instructor" }, // Reference to Instructor
  submissions: [String] // Array of submission IDs or file links
});

const courseSchema = new Schema({
  courseId: { type: String, unique: true, required: true },
  courseName: { type: String, required: true },
  cost: { type: Number, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: String, required: true },
  cohorts: { type: [String], default: [] }, // Set default to an empty array
  instructors: { type: [String], default: [] },

}, { timestamps: true });



// Model Exports
const Assignment = mongoose.model("Assignment", assignmentSchema);
const Course = mongoose.model("Course", courseSchema);

module.exports = { Assignment, Course };
