const express = require('express')
const {loginDataValidate , jwtAuth} = require('../MiddleWare/middleware.js')
const{home,logIn, logOut}= require('../Controllers/controller.js')
const router = express.Router()

router.get('/',home)
// router.post('/login',loginDataValidate,logIn)
// router.post('/logOut',jwtAuth,logOut)

module.exports  = router