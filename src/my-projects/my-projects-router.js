const express = require('express')
const formidableMiddleware = require('express-formidable');
const uuidv4 = require('uuid/v4')
const fs = require('fs') // Node FileSystem
const path = require('path')
const MyProjectsService = require('./my-projects-service')
const {requireAuth} = require('../middleware/jwt-auth')

const myProjectsRouter = express.Router()
const jsonBodyParser = express.json()

// Save options and events for formidable multipart form parser.
// This will parse the myProjects form so that the user images 
// are uploaded and available. 
// Files will be renamed with a UUID as file name, so there is no
// confusion when the server serves a file by name.
// Attributions: 
// https://github.com/utatti/express-formidable
// https://stackoverflow.com/questions/8359902/how-to-rename-files-parsed-by-formidable
// https://expressjs.com/en/starter/static-files.html (see app.js)
const formidableOptions = {
    uploadDir: '/uploads',
}
const formidableEvents = [
  { // Moves images into /uploads/ folder.
    event: 'fileBegin',
    action: function (req, res, next, name, file) { 
      file.path = __dirname + '/uploads/' + file.name;
     }
  },
  { // Renames the file with a UUID.
    event: 'file',
    action: function (req, res, next, name, file) { 
      file.name = uuidv4() + '.JPG'
      // Slices off the old file name from the old path and rebuilds a new path with the new file name.
      fs.rename(file.path, file.path.split("/").slice(0, -1).join('/') + '/' + file.name, (error) => error)
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
    const stitches = req.fields.stitch_patterns.split(',')

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