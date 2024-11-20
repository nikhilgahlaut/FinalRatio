const express = require('express');
const {
    getAllClient,
    addClient,
    home,
    updateClientServices,getUserServices,
} = require('../Controllers/ClientController.js');

const router = express.Router();

router.get('/', home);
router.get('/clientData', getAllClient);
router.post('/addClient', addClient);
router.post('/updateServices', updateClientServices);
router.get('/getUserServices', getUserServices);

module.exports = router;
