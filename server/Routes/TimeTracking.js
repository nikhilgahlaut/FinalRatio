const express = require('express');
const { home,getAlltime,postAlltime } = require('../Controllers/timeTrackingController');

const router = express();

router.get('/',home)
router.get('/getTime',getAlltime)
router.post('/addTime',postAlltime)

module.exports = router