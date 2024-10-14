require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use (cors())

const connectToDb = require('./Config/db.js')
// connectToDb()

const userRoutes = require('./Routes/Routes.js')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/',userRoutes)


module.exports = app