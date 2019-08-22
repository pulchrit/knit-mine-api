const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    // You can combine the route and post into one statement
    // when you know you will only need one request method. 
    // Here we only need POST for login authorization.
    // (Use separate .route() method when you want to chain
    // many request methods--POST, GET, PUT--to it.)
    .post('/api/auth/login', jsonBodyParser, (req, res, next) => {
        
        // Get email and pw from request body
        const {email, password} = req.body
        // Save email and pw to loginUser object.
        const loginUser = {email, password}

        // Validate email and pw. 
        // First, ensure neither is missing. 
        // Return error response if missing.
        for (const[key, value] of Object.entries(loginUser)) {
            if (value == null) {
                return res.status(400).json({error: `Missing '${key}' in request body`})
            }
        }
            // If both are present, validate that email is indeed from
            // a user in our database by calling this function in AuthService.
            AuthService.getUserWithEmail(
                req.app.get('db'),
                loginUser.email
            )
            // This returns a resolved promise (or an error which is 
            // caught below).
            // We need to check if there is a user or if the response is 
            // just undefined/empty.
            .then(dbUser => {
                // If dbUser is undefined/empty, return error response, BUT
                // don't give too much info. just say that user or pw is incorrect.
                if (!dbUser) {
                    return res.status(400).json({error: `Incorrect email or password`})
                }
                // If user IS found in the database, validate the password.
                // We are returning here, because this is the last step for 
                // a successful request. 
                // Compare passwords in AuthService file.
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(passwordMatch => {
                        // If passwords don't match, return error (again, for security, keep it
                        // generic as to whether it was a user_name or password issue).
                        if (!passwordMatch) {
                            return res.status(400).json({error: `Incorrect email or password`})
                        }
                        // If passwords do match, save the email as 
                        // the subject for the JWT token and save the user_id 
                        // as the payload to conceal in the JWT token.
                        // Payload should be an object. 
                        const subject = dbUser.email
                        const payload = {id: dbUser.id}
                        
                        res.send({
                            // Call createJWT from AuthService to create the JWT and
                            // send this in an object as the response to the login request.
                            authToken: AuthService.createJwt(subject, payload)
                        })
                    })
            })
            // Catch any errors/rejected promises and pass them to the 
            // last error-handling step of the middleware. 
            .catch(next)

    })

    module.exports = authRouter;