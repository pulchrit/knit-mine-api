const express = require('express')
const path = require('path')
const MyProjectsService = require('./my-projects-service')
const {requireAuth} = require('../middleware/jwt-auth')

const myProjectsRouter = express.Router()
const jsonBodyParser = express.json()

myProjectsRouter
  .route('/api/my-projects/')
  .all(requireAuth)
  .get(jsonBodyParser, (req, res, next) => {
    
    MyProjectsService.getAllProjectsForUser(
        req.app.get('db'), 
        // Get current user from req object. The current user object
        // was saved to the req object when requireAuth() ran. 
        req.user.id
    )
    .then(myProjects => {
        return res.json(myProjects.map(MyProjectsService.serializeAllProjects))
    })
    .catch(next)
  }) 
  .post(jsonBodyParser, (req, res, next) => {
    
    // Get stitches separately as they need to go into a different table than
    // the rest of the project.
    const stitches = req.body.stitch_patterns

    const newProject = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      gift_recipient: req.body.gift_recipient,
      gift_occasion: req.body.gift_occasion,
      yarn: req.body.yarn,
      needles: req.body.needles,
      pattern_id: parseInt(req.body.project_pattern) || null,
      user_id: req.user.id
    }

    // Check for required element: name.
    if (!newProject.name) {
        return res.status(400).json({
            error: `Missing 'name' in request body`
        })
    }
    
    MyProjectsService.insertProject(
      req.app.get('db'),
      newProject
    )
    // If there are any stitches to insert, insert them. 
    // Need async/await to ensure that all stitches are inserted before
    // the rest of the function executes.
    .then(async project => {
      if (stitches.length) {
        return await stitches.forEach(stitch => 
          MyProjectsService.insertProjectStitch(
              req.app.get('db'),
              project.id,
              stitch
          )) || project
      }
      return project
    })
    // Need async/await again here to ensure that serializeProject returns
    // completely (it calls another function that we need to wait for).
    .then(async project => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${project.id}`))
          .json(await MyProjectsService.serializeProject(req.app.get('db'), project))
          || project
    })
    .catch(next)
  })
  
  myProjectsRouter
    .route('/api/my-projects/:id')
    .get(requireAuth, (req, res, next) => {
      MyProjectsService.getProjectById(
        req.app.get('db'),
        req.params.id
      )
      .then(async project => {
        if (!project) {
            return res.status(404).json({
                error: `Project doesn't exist`
            }) 
        } else if (project.user_id !== req.user.id) {
            return res.status(401).json({
                error: `This is not one of your projects.`
            })
        }
        return res.json(await MyProjectsService.serializeProject(req.app.get('db'), project))
      })
      .catch(next)
    })
    
 
  module.exports = myProjectsRouter