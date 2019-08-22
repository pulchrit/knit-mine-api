const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {

    validatePassword(password) {
        REGEX_VALID_PASSWORD = /\d+/
        
        // Check that length is 8-72
        if (password.length < 8 || password.length > 72) {
            return `Password must be between 8 and 72 characters long`
        } 
        // regex.test(string) return true/false whereas string.match(regex)
        // returns a matched group from the string!
        if (!REGEX_VALID_PASSWORD.test(password)) {
            return `Password must contain at least one number`
        } 

        // Return null if password IS valid because this 
        // returns to the passwordError variable, which will be
        // passed to state and ultimately rendered, so if it's null, 
        // no error will be rendered.
        return null
    },

    // Don't return password for security reasons.
    serializeUser(user) {
        return {
            id: user.id,
            name: xss(user.name),
            email: xss(user.email),
        }
    },

    doesUserWithEmailExist(db, email) {
        return db('users')
        .where({email})
        .first()
        .then(user => {
            if(!user) {
                return false
            }
            return true
        })
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },

    hashPassword(password) {
        // salt of 12 for decent complexity of the hash
        // This returns a promise!
        return bcrypt.hash(password, 12)
    }
}

module.exports = UsersService