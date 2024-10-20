require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectToDb = require('./Config/db.js')
const userRoutes = require('./Routes/Routes.js')

app.use (cors())

app.use(cookieParser())

connectToDb()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/',userRoutes)


module.exports = app