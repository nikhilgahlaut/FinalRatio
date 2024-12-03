const mongoose = require('mongoose');

// Schema for monthly progress data
const progressSchema = new mongoose.Schema({
  proj_id: {
    type: Number,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: String, // e.g., "Jan", "Feb", etc.
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    required: true,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model('MonthlyProgress', progressSchema);
