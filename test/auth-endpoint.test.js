const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./fixtures')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')

describe('Auth Endpoints', () => {
    let db 

    // Create test data.
    const testUsers = fixtures.makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })

        // We need to set this test database on our app file here,
        // because the tests do not run the server.js file. They just
        // call app directly, so we need to set the test database/knex 
        // instance as a property of app in this test file.
        app.set('db', db)
    })

    // After all tests disconnect from the database.
    after('disconnect from db', () => db.destroy())
    
    // Before any/all tests, remove data from tables. 
    // Because we have three related tables, we have to truncate all
    // data from all tables and reset the primary key generator sequence.
    // We need to use the raw() method of knex to execute SQL (because knex
    // doesn't have a method to accomplish what we want.)
    before('clean the table', () => () => helpers.cleanTables(db))

    // Remove data after each test so that data from a previous test
    // isn't leaking into a subsequent test and causing it to fail.
    // As above, we need to do this using raw() so that we can specify
    // that we want data removed from all three tables and that we want 
    // the primary keys sequence numbers to reset. 
    afterEach('remove all table data', () => helpers.cleanTables(db))

    describe(`POST /api/auth/login`, () => {
        
        // Before each and every test in this context, add the data.
        // Users must be added before anything else because all other 
        // tables depend on Users table.
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

        const requiredFields = ['email', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                email: testUser.email,
                password: testUser.password
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                
                // Delete one of the fields on each iteration to test when it's missing.
                delete loginAttemptBody[field]

                return request(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })

        it(`responds with 400 'invalid email or password' when invalid email`, () => {
            const userInvalidUser = { email: 'user-not', password: 'exists'}
            return request(app)
                .post('/api/auth/login')
                .send(userInvalidUser)
                .expect(400, {error: `Incorrect email or password`})
        })
        
        it(`responds 400 'invalid email or password' when bad password`, () => {
                const userInvalidPass = { email: testUser.email, password: 'incorrect' }
                return request(app)
                   .post('/api/auth/login')
                   .send(userInvalidPass)
                   .expect(400, { error: `Incorrect email or password` })
        })

        it(`responds 200 with JWT auth token using secret when credentials are valid`, () => {
            const userValidCreds = {
                email: testUser.email,
                password: testUser.password
            }

            const expectedToken = jwt.sign(
                {id: testUser.id},
                process.env.JWT_SECRET,
                {
                    subject: testUser.email,
                    algorithm: 'HS256'
                }
            )

            return request(app)
                .post('/api/auth/login')
                .send(userValidCreds)
                .expect(200, {
                    authToken: expectedToken
                })
        })
    })
})