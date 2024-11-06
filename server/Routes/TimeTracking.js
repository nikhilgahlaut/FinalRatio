const express = require('express');
const { home,getAlltime,postAlltime, updateTime } = require('../Controllers/timeTrackingController');

const router = express();

router.get('/',home)
router.get('/getTime',getAlltime)
router.post('/addTime',postAlltime)
router.put('/updateTime/:id',updateTime)

module.exports = router