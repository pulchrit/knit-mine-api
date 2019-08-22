const AuthService = require('../auth/auth-service')

// This function will ensure that all protected endpoints 
// have an authenticated JWT in their headers. 
function requireAuth(req, res, next) {
    
    // Get the AuthToken from the Authorization header
    const authToken = req.get('Authorization') || ''

    let bearerToken
    // Change authToken to lower case and check if it 
    // starts with the word and a space 'bearer '.
    // If it doesn't, respond with an error saying the bearer 
    // token is missing.
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({error: 'Missing JWT bearer token'})
    } else {
        // If a bearerToken is included, then we slice off the
        // word 'bearer ' to get just the token for comparison.
        bearerToken = authToken.slice('bearer '.length, authToken.length)
    }

    try {
        // Verify the JWT token. If verified, the JWT 
        // will be returned. The payload should include the
        // user_id for this authenticated user. The subject
        // should include the user_name for this authenticated
        // user.
        const payload = AuthService.verifyJwt(bearerToken)

        // Get user object from the DB. 
        AuthService.getUserWithUserName(
            req.app.get('db'),
            payload.sub // the sub/subject is the user_name
        )
        .then(user => {
            // If the user isn't found in the DB, return an error.
            if (!user) {
                return res.status(401).json({error: 'Unauthorized request'})
            }
            // If the user is found, attach the user object to the 
            // request object so that you can use it in the other 
            // endpoints.
            req.user = user
            next() // call the next middleware step
        })
        // If the getUserWithUserName promise rejects, catch error here.
        .catch(error => {
            console.error(error)
            next(error) // pass this error to the next (error handling) middleware
        })
    // If the try block above fails (i.e., if verifyJwt fails),
    // return a response saying the user is not authenticated. 
    } catch(error) {
        res.status(401).json({error: 'Unauthorized request'})
    }

}

module.exports = {requireAuth}