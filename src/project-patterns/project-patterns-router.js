const express = require('express')
const path = require('path')
const ProjectPatternsService = require('./project-patterns-service')
const {requireAuth} = require('../middleware/jwt-auth')

const projectPatternsRouter = express.Router()
const jsonBodyParser = express.json()

projectPatternsRouter
  .route('/api/project-patterns/')
  .get((req, res, next) => {
    ProjectPatternService.getAllProjectPatterns(req.app.get('db'))
      .then(projectPatterns => {
        res.json(ProjectPatternsService.serializeProjectds(projectPatterns))
      })
      .catch(next)
  })