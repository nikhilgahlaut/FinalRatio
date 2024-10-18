const express = require('express')
const{home}= require('../Controllers/controller.js')
const router = express.Router()

router.get('/',home)

module.exports  = router