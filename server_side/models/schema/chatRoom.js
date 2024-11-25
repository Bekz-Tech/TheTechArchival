const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

// Chatroom Schema
const chatroomSchema = new Schema({
  name: { type: String, required: true, unique: true }, // Chatroom name
  participants: [{ type: ObjectId, ref: "User" }], // List of participant User IDs
  messages: [{
    sender: { type: ObjectId, ref: "User", required: true }, // User ID of the sender
    content: { type: String, required: true }, // Message content
    timestamp: { type: Date, default: Date.now }, // Timestamp of the message
  }], // Array of messages as embedded objects
}, { timestamps: true });

const Chatroom = mongoose.model("Chatroom", chatroomSchema);
module.exports = Chatroom;
