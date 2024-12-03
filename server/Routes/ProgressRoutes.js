const express = require('express');
const router = express.Router();
const { saveOrUpdateMonthlyProgress,getMonthlyProgress  } = require('../controllers/progressController');

// Route to fetch progress data for a specific project
router.get('/:proj_id/:serviceId', getMonthlyProgress);

// Route to save or update progress data
router.post('/save', saveOrUpdateMonthlyProgress);

module.exports = router;
