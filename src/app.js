require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const projectPatternsRouter = require('./project-patterns/project-patterns-router')
const stitchPatternsRouter = require('./stitch-patterns/stitch-patterns-router')
const myProjectsRouter = require ('./my-projects/my-projects-router')
const usersRouter = require('./users/users-router') 

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'dev', {
  skip: () => NODE_ENV === 'test',
}))

const corsOptions = {
  origin: "https://knit-mine-app.now.sh", // Client origin, will set Access-Control-Allow-Origin header
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Apply to all request methods, this is also the default setting
  //allowedHeaders: "origin,content-type,authorization", // Specify Access-Control-Allow_Headers base on what your app uses
  preflightContinue: true, // Pass the CORS preflight response to the next handler
  optionsSuccessStatus: 204 // Provides a status code for a successful OPTIONS request to legacy browsers
}

app.options('*', cors(corsOptions)) // Enable pre-flight requests for all request endpoints

app.use(cors(corsOptions)) // Applies cors middleware

app.use(helmet())

// Sets up directory to store and server static images 
// (i.e., project images the user has uploaded)
// Attribution: https://expressjs.com/en/starter/static-files.html
app.use(express.static('src/my-projects/uploads'))

app.use(authRouter)
app.use(usersRouter)
app.use(projectPatternsRouter)
app.use(stitchPatternsRouter)
app.use(myProjectsRouter)
 

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { error: error.message, object: error }
  }
  res.status(500).json(response)
})

module.exports = app
