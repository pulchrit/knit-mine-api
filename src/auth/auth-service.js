const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

// AuthService talks to the database using knex.
const AuthService = {

    // Returns user object from database for the email.
    getUserWithEmail(db, email) {
        return db('users')
        .where({email})
        .first() // return first user in array, which should be the only user
    },

    // Use bcrypt's compare method to see if the 
    // password string the user entered matches the 
    // hashed password stored in the database.
    comparePasswords(password, dbHash) {
        return bcrypt.compare(password, dbHash)
    },

    // Create the JWT bearer token using the subject
    // and payload supplied by the request and validated 
    // by auth-router. Use the JWT secret from the .env
    // file by way of the config file.
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    },

    // Verifies the token sent with the request to a protected
    // endpoint was made with this server's secret.
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256']
        })
    }
}

module.exports = AuthService