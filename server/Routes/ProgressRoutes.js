const express = require('express');
const router = express.Router();
const { getProgressData, saveProgressData } = require('../controllers/progressController');

// Route to fetch progress data for a specific project
router.get('/:proj_id', getProgressData);

// Route to save or update progress data
router.post('/save', saveProgressData);

module.exports = router;
