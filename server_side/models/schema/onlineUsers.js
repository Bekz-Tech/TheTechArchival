const mongoose = require('mongoose');
const { assignmentSchema } = require('./courseSchema');

// Message Schema Definition
const messageSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  delivered: { type: Boolean, default: false },
  isSentByUser: { type: Boolean, default: false },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  receiver: { type: Map, of: String },
  sender: { type: Map, of: String },
  timestamp: { type: String, required: true }
});

// Notification Schema Definition
const notificationSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true, 
    default: () => new mongoose.Types.ObjectId().toString()
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  readStatus: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  actionLink: { type: String, default: '' },
  source: { type: String, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
});

notificationSchema.index({ recipient: 1, readStatus: 1 });

// Admin Schema
const adminSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: String, default: new Date().toISOString() },
  updatedAt: { type: String, default: new Date().toISOString() },
  idCardUrl: { type: String, default: '' },
  notifications: [notificationSchema],
  messages: [messageSchema],
  userId: { type: String, unique: true },// Keep the userId field
  profilePictureUrl: { type: String, required: true},

});

// SuperAdmin Schema
const superAdminSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, default: 'superadmin' },
  createdAt: { type: String, default: new Date().toISOString() },
  updatedAt: { type: String, default: new Date().toISOString() },
  idCardUrl: { type: String, default: '' },
  notifications: [notificationSchema],
  messages: [messageSchema],
  userId: { type: String, unique: true },
  profilePictureUrl: { type: String, required: true},

  
});
 
// Instructor Schema
const instructorSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePictureUrl: { type: String, required: true},
  idCardUrl: { type: String, default: '' },
  instructorId: { type: String, required: true, unique: true },
  averageRating: { type: Number, default: 0 },
  program: { type: String, required: true },
  studentsAssigned: { type: [String], default: [] },
  timeTable: { type: [String], default: [] },
  role: { type: String, default: 'instructor' },
  notifications: [notificationSchema],
  messages: [messageSchema],
  userId: { type: String, unique: true },
  createdAt: { type: String, default: new Date().toISOString() },
  updatedAt: { type: String, default: new Date().toISOString() }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePictureUrl: { type: String, required: true},
  idCardUrl: { type: String, default: '' },
  studentId: { type: String, required: true, unique: true },
  averageRating: { type: Number, default: 0 },
  assignedInstructor: { type: [String], default: [] },
  cohort: { type: String, default: '' },
  program: { type: String, default: '' },
  emergencyContactName: { type: String, required: true },
  emergencyContactRelationship: { type: String, required: true },
  emergencyContactPhone: { type: String, required: true },
  role: { type: String, default: 'student' },
  notifications: [notificationSchema],
  messages: [messageSchema],
  studentProgress: { type: Number, default: 0 },
  userId: { type: String, unique: true },
  createdAt: { type: String, default: new Date().toISOString() },
  updatedAt: { type: String, default: new Date().toISOString() },
  amountPaid: { type: Number, required: true }
});

// Middleware to set userId as _id
const setUserId = function(next) {
  if (!this.userId) {
    this.userId = this._id.toString();
  }
  next();
};

// Apply pre-save middleware to all schemas
adminSchema.pre('save', setUserId);
superAdminSchema.pre('save', setUserId);
instructorSchema.pre('save', setUserId);
studentSchema.pre('save', setUserId);

// Export Models
const Admin = mongoose.model('Admin', adminSchema);
const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
const Instructor = mongoose.model('Instructor', instructorSchema);
const Student = mongoose.model('OnlineStudent', studentSchema);

module.exports = { Admin, SuperAdmin, Instructor, Student };
