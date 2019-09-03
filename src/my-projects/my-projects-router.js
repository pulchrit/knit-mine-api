const express = require('express')
//const bodyParser = require('body-parser')
const formidableMiddleware = require('express-formidable');
//const fs = require('fs') // Node FileSystem
const path = require('path')
const MyProjectsService = require('./my-projects-service')
const {requireAuth} = require('../middleware/jwt-auth')

const myProjectsRouter = express.Router()
const jsonBodyParser = express.json()

// Save options and events for formidable multipart form parser.
// This will parse the myProjects form so that the user images 
// are uploaded and available. 
// Attributions: 
// https://github.com/utatti/express-formidable
// https://expressjs.com/en/starter/static-files.html (see app.js)
const formidableOptions = {
    uploadDir: '/uploads',
}
const formidableEvents = [
  {
    event: 'fileBegin',
    action: function (req, res, next, name, file) { 
      file.path = __dirname + '/uploads/' + file.name;
     }
  }
]


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
  // Use express-formidable as the middleware to parse the multipart form data and image
  .post(formidableMiddleware(formidableOptions, formidableEvents), (req, res, next) => {

    // Creates array of stitch ids submitted by client.
    // And converts them to integers for insertion in to database.
    let stitches = req.fields.stitch_patterns.split(',') 
    stitches = parseInt(...stitches) || []

    const newProject = {
      name: req.fields.name,
      image: req.files.image,
      description: req.fields.description,
      gift_recipient: req.fields.gift_recipient,
      gift_occasion: req.fields.gift_occasion,
      yarn: req.fields.yarn,
      needles: req.fields.needles,
      pattern_id: parseInt(req.fields.project_pattern) || null,
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