const express = require('express');
const { getAll, serviceAdd, home } = require('../Controllers/serviceController');

const router = express();

router.get('/',home)
router.get('/allservices',getAll)
router.post('/add',serviceAdd)

module.exports = router