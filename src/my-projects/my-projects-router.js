const express = require('express')
const path = require('path')
const MyProjectsService = require('./my-projects-service')
const {requireAuth} = require('../middleware/jwt-auth')

const myProjectsRouter = express.Router()
const jsonBodyParser = express.json()
const rawBodyParser = express.raw({limit: '10mb', type: 'image/*'})

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
        .then(myProjects => myProjects.map(MyProjectsService.serializeProject))
        .then(myCompleteSerializedProjects => res.json(myCompleteSerializedProjects)) 
        .catch(next)
  })
  .post(jsonBodyParser, rawBodyParser, (req, res, next) => {

    const stitches = req.body.stitches || []

    const newProject = {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      gift_recipient: req.body.recipient,
      gift_occasion: req.body.occasion,
      yarn: req.body.yarn,
      needles: req.body.needles,
      pattern_id: req.body.pattern_id,
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
    .then(project => {
        return stitches.forEach(stitch => 
            MyProjectsService.insertProjectStitch(
                req.app.get('db'),
                project.id,
                stitch
            )
        ) || project
    })
    .then(async project => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${project.id}`))
          .json(await MyProjectsService.serializeProject(req.app.get('db'), project))
          || project
    })
   /*  .then(stitches => {
        res
            .status(201)
            .json(stitches)
    }) */
    .catch(next)
  })
  
  /* projectPatternsRouter
    .route('/api/project-patterns/:id')
    .all(requireAuth)
    .all((req, res, next) => {
      ProjectPatternsService.getById(
        req.app.get('db'),
        req.params.id
      )
      /* ???? .then(serializedProjects => serializedProjects.map(project => {
                const stitches = MyProjectsService.getStitchesForProject(
                    req.app.get('db'),
                    project.id
                )
                console.log('stitches from get stitches for project:', stitches)
                //const serializedStitches = stitches.map(MyProjectsService.serializeStitch)
                return {
                    ...project,
                    stitches: stitches
                }
            })
        ) */
        // ???? .then(serializedProjects => res.json(serializedProjects))
      /*.then(pattern => {
        if (!pattern) {
          return res.status(404).json({
            error: `Pattern doesn't exist`
          }) 
        }
        // Save the resolved pattern object back onto the res
        // object so that you can use it in subsequent CRUD methods.
        res.pattern = pattern
        next()
      })
      .catch(next)
    })
    .get((req, res, next) => {
        // We already have this resolved pattern from the all() method,
        // so we can just return it here to the get() method.
        res.json(ProjectPatternsService.serializePattern(res.pattern))
    })
    // Adding the delete function so that it's in place for future
    // iteration
    .delete((req, res, next) => {
      ProjectPatternsService.deletePattern(
        req.app.get('db'),
        req.params.id
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })
    
 */
  module.exports = myProjectsRouter