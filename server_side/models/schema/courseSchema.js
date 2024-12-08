const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// Cohort Schema remains the same as you defined earlier
const cohortSchema = new Schema({
  courseId: { type: String, required: true },
  cohortName: { type: String, required: true, unique: true },
  instructor: { type: String },
  
  assignments: [{
    id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    submissions: [String], // Array of submission IDs or file links
  }],
  
  students: { type: [String], default: [] },
  
  timetable: [{
    id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    topic: { type: String, required: true },
    done: { type: Boolean, default: false },
  }],
}, { timestamps: true });

cohortSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Updated Course Schema with direct curriculum field
const courseSchema = new Schema({
  cohorts: { type: [String], default: [] },
  courseName: { type: String, required: true },
  courseId: { type: String, required: true, unique: true },
  cost: { type: Number, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  instructors: { type: [String], default: [] },
  
  // Direct curriculum field as an array of objects with each object having its own structure
  curriculum: [{
    _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Custom _id for each curriculum entry
    topic: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    resources: { type: [String], default: [] }, // Resources like links, files, etc.
  }],
  
  students: { type: [String], default: [] },
}, { timestamps: true });

courseSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Models Export
const Cohort = mongoose.model("Cohort", cohortSchema);
const Course = mongoose.model("Course", courseSchema);

module.exports = { Cohort, Course };
