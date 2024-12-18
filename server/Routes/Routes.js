const express = require('express')
const {loginDataValidate , signUpDataValidate, jwtAuth} = require('../MiddleWare/middleware.js')
const{home,logIn,logout,signup,authUser,updateAccess,getUsersByStatus,getUserProject}= require('../Controllers/controller.js')
// const signUpDataValidate = require('../MiddleWare/middleware.js')

const router = express.Router()
router.get('/',home)
router.post('/updateAccess',updateAccess)//user Authorization
router.get('/access/getUsers',getUsersByStatus)//user Authorization
router.post('/signup',signUpDataValidate,signup)
router.post('/login',loginDataValidate,logIn)
router.get('/authuser/', jwtAuth, authUser)//user authentication
router.get('/logout/',jwtAuth,logout)
router.get('/projects/:userId', getUserProject);
// router.get('/projects/:userId', getUserProject);



module.exports  = router