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
const signS3Router = require('./sign-s3/sign-s3-router')
const myProjectsRouter = require ('./my-projects/my-projects-router')
const usersRouter = require('./users/users-router') 

const app = express()

// Morgan is a package for status logging.
app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'dev', {
  skip: () => NODE_ENV === 'test',
}))

// Cors is a package that helps set up CORS options properly.
const corsOptions = {
  origin: "https://knit-mine-app.now.sh", //CLIENT_ORIGIN,  //"https://knit-mine-app.now.sh", // Client origin, will set Access-Control-Allow-Origin header
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Apply to all request methods, this is also the default setting
  preflightContinue: true, // Pass the CORS preflight response to the next handler
}

app.options('*', cors()) // Enable pre-flight requests for all request endpoints

app.use(cors(corsOptions)) // Applies cors middleware

// Helmet is a package for securing HTTP headers.
app.use(helmet())

// Endpoint routers
app.use(authRouter)
app.use(usersRouter)
app.use(projectPatternsRouter)
app.use(stitchPatternsRouter)
app.use(signS3Router)
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
