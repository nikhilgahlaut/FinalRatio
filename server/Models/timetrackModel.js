const mongoose = require('mongoose');

const timetracking = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  taskType: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  assignee: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date, //YYYY-MM-DD
    required: true
  },
  budgetHours: {
    type: Number,
    required: true
  },
  loggedHours: {
    type: Number,
    default: 0
  },
  updatedOn: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: String
  }
});

const taskSchema = mongoose.model('taskSchema', timetracking);

module.exports = taskSchema;