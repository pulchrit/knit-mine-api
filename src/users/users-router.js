const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter 
    .post('/api/users/', jsonBodyParser, (req, res, next) => {

        // Get user data from request body.
        const {name, email, password} = req.body

        // Validate user data.
        // First check that all required fields are present.
        for (const field of ['name', 'email', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({error: `Missing '${field}' in request body`})
            }
        }

        // Check that password meets requirements (1 number, 8-72 chars)
        const passwordError = UsersService.validatePassword(password)
        if (passwordError) {
            return res.status(400).json({error: passwordError})
        }

        // Check that email is unique (i.e. doesn't exist in the 
        // database). Knex returns a promise that you must handle. 
        UsersService.doesUserWithEmailExist(
            req.app.get('db'),
            email
        )
        .then(userExists => {
            if (userExists) {
                return res.status(400).json({error: `Email is already in use`})
            }  

            // If the email does not exist, the user can 
            // be added to the database.
            // First, bcrypt the password. bcrypt.hash returns a promise, so 
            // we have to resolve it.
            return UsersService.hashPassword(password)
                .then(hashedPassword => {
                    const newUser = {
                        name,
                        email,
                        password: hashedPassword
                    }

                    // Then, insert the user into the database.
                    // Knex returns a promise, so we have to resolve it here.
                    return UsersService.insertUser(
                        req.app.get('db'),
                        newUser
                    )
                    .then(user => {
                        res
                            // return status created
                            .status(201)
                            // return location/url 
                            .location(path.posix.join(req.originalUrl, `${user.id}`))
                            // Serialize user before returning in res body
                            // because we want to add xss and not include the 
                            // password.
                            .json(UsersService.serializeUser(user))
                      })
                })
                .catch(next)
        })
        
    })

module.exports = usersRouter