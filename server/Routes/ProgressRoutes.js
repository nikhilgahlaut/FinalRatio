const express = require('express');
const router = express.Router();
const { saveProgress,fetchProgress} = require('../Controllers/ProgressController');

// Route to fetch progress data for a specific project
router.get('/getProjects', fetchProgress);

// Route to save or update progress data
router.post('/saveProjects', saveProgress);

module.exports = router;
