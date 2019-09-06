const express = require('express')
const path = require('path')
const StitchPatternsService = require('./stitch-patterns-service')
const {requireAuth} = require('../middleware/jwt-auth')

const stitchPatternsRouter = express.Router()
const jsonBodyParser = express.json()

stitchPatternsRouter
  .route('/api/stitch-patterns/')
  .get(requireAuth, jsonBodyParser, (req, res, next) => {

    StitchPatternsService.getAllStitchPatternsForUser(
      req.app.get('db'), 
      // Get current user from req object. The current user object
      // was saved to the req object when requireAuth() ran.   
      req.user.id
      )
      .then(stitchPatterns => {
        return res.json(stitchPatterns.map(StitchPatternsService.serializePattern))
      })
      .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {

    const newPattern = {
      name: req.body.name,
      url: req.body.url,
      image_url: req.body.image_url,
      notes: req.body.notes,
      user_id: req.user.id
    }

    // Check for required elements: name, url.
    for (const field of ['name', 'url']) {
      if (!newPattern[field]) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      }
    }
    
    StitchPatternsService.insertPattern(
      req.app.get('db'),
      newPattern
    )
    .then(pattern => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${pattern.id}`))
        .json(StitchPatternsService.serializePattern(pattern))
    })
    .catch(next)
  })
  
  stitchPatternsRouter
    .route('/api/stitch-patterns/:id')
    .all(requireAuth)
    .all((req, res, next) => {
        StitchPatternsService.getById(
        req.app.get('db'),
        req.params.id
      )
      .then(pattern => {
        if (!pattern) {
          return res.status(404).json({
            error: `Pattern doesn't exist`
          }) 
        } else if (pattern.user_id !== req.user.id) {
          return res.status(401).json({
              error: `This is not one of your stitches.`
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
        res.json(StitchPatternsService.serializePattern(res.pattern))
    })
    // Adding the delete function so that it's in place for future
    // iteration
    .delete((req, res, next) => {
        StitchPatternsService.deletePattern(
        req.app.get('db'),
        req.params.id
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })
    

  module.exports = stitchPatternsRouter