require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectToDb = require('./Config/db.js')
const userRoutes = require('./Routes/Routes.js')
const serviceRoutes = require('./Routes/ServiceRoutes.js')
const clientRoutes = require('./Routes/ClientRoutes.js')
const progress = require('./Routes/ProgressRoutes.js')

app.use(cors({
  origin: 'http://localhost:5173', // Specify the Vite frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(cookieParser())

connectToDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/user', userRoutes)
app.use('/services', serviceRoutes)
app.use('/client',clientRoutes)
app.use('/progress',progress)

module.exports = app