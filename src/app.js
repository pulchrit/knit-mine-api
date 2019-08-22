require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
//const projectPatternsRouter = require('./project-patterns/project-patterns-router')
/* const stitchPatternsRouter = require('./stitch-patterns/stitch-patterns-router')
const myProjectsRouter = require ('./my-projects/my-projects-router')*/
const usersRouter = require('./users/users-router') 

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'dev', {
  skip: () => NODE_ENV === 'test',
}))

app.use(cors(
    {
        origin: CLIENT_ORIGIN
    }
))

app.use(helmet())

app.use(authRouter)
app.use(usersRouter)
//app.use(projectPatternsRouter)
/* app.use(stitchPatternsRouter)
app.use(myProjectsRouter)*/
 

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
