// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Assignment Schema
// const assignmentSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   dueDate: { type: Date },
//   courseId: { type: Schema.Types.ObjectId, ref: "Course" },  // Reference to Course
//   createdBy: { type: Schema.Types.ObjectId, ref: "Instructor" }, // Reference to Instructor
//   submissions: [String] // Array of submission IDs or file links
// });

// // Course Schema
// const courseSchema = new Schema({
//   courseId: { type: String, unique: true, required: true },
//   courseName: { type: String, required: true },
//   cost: { type: String, required: true },
//   duration: { type: String, required: true },
//   description: { type: String, required: true },
//   startDate: { type: String, required: true },
//   assignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }], // Reference to Assignment documents
//   cohorts: [String], // Array of cohort names/IDs
// }, { timestamps: true });

// // Instructor Schema
// const instructorSchema = new Schema({
//   userId: { type: String, unique: true, required: true },
//   email: { type: String, unique: true, required: true },
//   role: { type: String, enum: ["instructor", "admin"], default: "instructor" },
//   courses: [{ type: Schema.Types.ObjectId, ref: "Course" }] // Reference to Course documents
// });

// // Model Exports
// const Assignment = mongoose.model("Assignment", assignmentSchema);
// const Course = mongoose.model("Course", courseSchema);
// const Instructor = mongoose.model("Instructor", instructorSchema);

// module.exports = { Assignment, Course, Instructor };