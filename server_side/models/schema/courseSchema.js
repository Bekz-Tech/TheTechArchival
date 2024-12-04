const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// Cohort Schema
const cohortSchema = new Schema({
  courseId: { type: String, required: true },
  cohortName: { type: String, required: true, unique: true  },
  instructor: { type: String },
  assignments: [{
    id: { type: ObjectId, default: () => new ObjectId() }, // Custom `id` field for each assignment
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    submissions: [String], // Array of submission IDs or file links
  }], // Array of assignments
  students: { type: [String], default: [] }, // List of student IDs
  timetable: [{
    id: { type: ObjectId, default: () => new ObjectId() }, // Custom `id` field for each timetable entry
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    topic: { type: String, required: true },
    done: { type: Boolean, default: false }, // Default to false
  }], // Array of timetable entries
}, { timestamps: true });

// Virtual field to expose `id` instead of `_id`
cohortSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Course Schema
const courseSchema = new Schema({
  cohorts: { type: [String], default: [] },
  courseName: { type: String, required: true },
  courseId: { type: String, required: true, unique: true }, // Add courseId field
  cost: { type: Number, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  instructors: { type: [String], default: [] }, // Array of instructor IDs
  curriculum: { type: [String], default: [] }, // Curriculum topics
  students: { type: [String], default: [] }, // List of student IDs
}, { timestamps: true });

// Virtual field to expose `id` instead of `_id`
courseSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Models Export
const Cohort = mongoose.model("Cohort", cohortSchema);
const Course = mongoose.model("Course", courseSchema);

module.exports = { Cohort, Course };
