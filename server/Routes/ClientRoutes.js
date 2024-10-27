const express = require('express');
const { getAllClient, addClient, home } = require('../Controllers/ClientController.js');

const router = express();

router.get('/',home)
router.get('/clientData',getAllClient)
router.post('/addclient',addClient)

module.exports = router