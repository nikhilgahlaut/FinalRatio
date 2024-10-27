const mongoose = require('mongoose');

// Sub-schema for monthly data
const monthlyDataSchema = new mongoose.Schema({
    progress: {
        type: Number,
        default: 0,
        required: true
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
});

// Main schema for project data
const progresSchema = new mongoose.Schema({
    proj_id: {
        type: Number,
        required: true
    },
    serviceId: {
        type: Number,
        required: true
    },
    data: {
        Jan: { type: monthlyDataSchema, default: () => ({}) },
        Feb: { type: monthlyDataSchema, default: () => ({}) },
        Mar: { type: monthlyDataSchema, default: () => ({}) },
        Apr: { type: monthlyDataSchema, default: () => ({}) },
        May: { type: monthlyDataSchema, default: () => ({}) },
        Jun: { type: monthlyDataSchema, default: () => ({}) },
        Jul: { type: monthlyDataSchema, default: () => ({}) },
        Aug: { type: monthlyDataSchema, default: () => ({}) },
        Sep: { type: monthlyDataSchema, default: () => ({}) },
        Oct: { type: monthlyDataSchema, default: () => ({}) },
        Nov: { type: monthlyDataSchema, default: () => ({}) },
        Dec: { type: monthlyDataSchema, default: () => ({}) }
    }
});

// Export the model
module.exports = mongoose.model('Progress', progresSchema);
