const mongoose = require('mongoose');

const timetracking = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    index: true,
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
    default: ""
  },
  loggedHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['TO-DO', 'In-Progress','Complete','Done'],
    default: "TO-DO"
  },
  updatedOn: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: String,
    default: ""
  }
});

const taskSchema = mongoose.model('taskSchema', timetracking);

module.exports = taskSchema;