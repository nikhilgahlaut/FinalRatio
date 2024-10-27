const express = require('express');
const router = express.Router();
const {home,createProject,getProject,updateProgress,getAllProjects} = require('../Controllers/ProgressController');


router.get('/',getAllProjects)
// Route to create a new progress
router.post('/create',createProject);

// Route to get a specific progress
router.get('/:proj_id/:serviceId',getProject);

// Route to update progress for a specific month
router.put('/update-progress/:proj_id/:serviceId/:month',updateProgress);

module.exports = router;
