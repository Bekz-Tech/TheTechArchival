const mongoose = require('mongoose');

// Message Schema Definition
const messageSchema = new mongoose.Schema({
  delivered: { type: Boolean, default: false },
  isSentByUser: { type: Boolean, default: false },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  receiver: { type: Map, of: String },  // Receiver info as a Map
  sender: { type: Map, of: String },    // Sender info as a Map
  timestamp: { type: String, required: true }
});

// Notification Schema Definition
const notificationSchema = new mongoose.Schema({
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now // Use `Date` type for proper date handling
  },
  type: { 
    type: String, 
    enum: ['info', 'warning', 'error', 'success'], // Specify types for easy categorization
    default: 'info' // Default to 'info' type
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, // Store the recipient's user ID
    ref: 'User', // Reference to the User model (admin, superadmin, etc.)
    required: true
  },
  readStatus: { 
    type: Boolean, 
    default: false // Track whether the notification has been read or not
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], // Indicate notification priority
    default: 'medium' // Default to medium priority
  },
  actionLink: { 
    type: String, 
    default: '' // Optional link for taking action directly from the notification
  },
  source: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model who triggered the notification
    required: false // Optional, track who generated the notification
  },
  isDeleted: { 
    type: Boolean, 
    default: false // Flag for soft deletion of notifications
  }
});

// Index for faster querying by recipient and read status
notificationSchema.index({ recipient: 1, readStatus: 1 });

// Admin Schema
const adminSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB ObjectId
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: String, default: new Date().toISOString() },
  updatedAt: { type: String, default: new Date().toISOString() },
  idCardUrl: { type: String, default: '' },  // New idCardUrl field
  notifications: [notificationSchema],  // Embedding notification schema
  messages: [messageSchema]             // Embedding message schema
});

// SuperAdmin Schema
const superAdminSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB ObjectId
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: 'superadmin' },
  createdAt: { type: String, default: new Date().toISOString() },
  updatedAt: { type: String, default: new Date().toISOString() },
  idCardUrl: { type: String, default: '' },  // New idCardUrl field
  notifications: [notificationSchema],  // Embedding notification schema
  messages: [messageSchema]             // Embedding message schema
});

// Instructor Schema
const instructorSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB ObjectId
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePictureUrl: { type: String, default: '' },
  idCardUrl: { type: String, default: '' },  // New idCardUrl field
  instructorId: { type: String, required: true, unique: true },
  averageRating: { type: Number, default: 0 },
  programsAssigned: { type: [String], default: [] },
  studentsAssigned: { type: [String], default: [] },
  courses: { type: [String], default: [] },
  assigment: { type: [String], default: [] },
  timeTable: { type: [String], default: [] },
  program: { type: String, default: '' },  // New program field
  role: { type: String, default: 'instructor' },
  notifications: [notificationSchema],  // Embedding notification schema
  messages: [messageSchema]             // Embedding message schema
});

// Student Schema
const studentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB ObjectId
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePictureUrl: { type: String, default: '' },
  idCardUrl: { type: String, default: '' },  // New idCardUrl field
  studentId: { type: String, required: true, unique: true },
  averageRating: { type: Number, default: 0 },
  assignedInstructor: { type: [String], default: [] },
  courses: { type: [String], default: [] },
  cohort: { type: String, default: '' },
  program: { type: String, default: '' },  // New program field
  emergencyContactName: { type: String, required: true },  // New emergency contact fields
  emergencyContactRelationship: { type: String, required: true },
  emergencyContactPhone: { type: String, required: true },
  role: { type: String, default: 'student' },
  notifications: [notificationSchema],  // Embedding notification schema
  messages: [messageSchema],            // Embedding message schema
  studentProgress: { type: Number, default: 0 },
  assigment: { type: [String], default: [] },
  timeTable: { type: [String], default: [] },
});

// Export Models
const Admin = mongoose.model('Admin', adminSchema);
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
const Instructor = mongoose.model('Instructor', instructorSchema);
const Student = mongoose.model('OnlineStudent', studentSchema);

// Export the models to use elsewhere in your application
module.exports = { Admin, SuperAdmin, Instructor, Student };
