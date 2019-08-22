const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./fixtures')
const helpers = require('./test-helpers')
const bcrypt = require('bcryptjs')

describe.only('User Endpoint', () => {
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

    describe(`POST /api/users/`, () => {
        
        
        context(`Unhappy path`, () => {

            // Before each and every test in this context, add the data.
            // Users must be added before anything else because all other 
            // tables depend on Users table.
            beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

            const requiredFields = ['name', 'email', 'password']

            requiredFields.forEach(field => {
                
                const registerAttemptBody = {
                    name: testUser.name,
                    email: testUser.email,
                    password: testUser.password
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    
                    // Delete one of the fields on each iteration to test when it's missing.
                    delete registerAttemptBody[field]

                    return request(app)
                        .post('/api/users/')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                })
            })

            it(`responds with 400 'Password must be between 8 and 72 characters long'`, () => {
                const tooShortPasswordUser = {
                    name: "Good name",
                    email: "goodemail@good.com",
                    password: '2short'
                }

                return request(app)
                    .post('/api/users/')
                    .send(tooShortPasswordUser)
                    .expect(400, {
                        error: `Password must be between 8 and 72 characters long`
                    })
            })

            it(`responds with 400 'Password must be between 8 and 72 characters long'`, () => {
                const tooLongPassword = new Array(74).fill(1).join('')
                const tooLongPasswordUser = {
                    name: "Good name",
                    email: "goodeamil@good.com",
                    password: tooLongPassword
                }

                return request(app)
                    .post('/api/users/')
                    .send(tooLongPasswordUser)
                    .expect(400, {
                        error: `Password must be between 8 and 72 characters long`
                    })
            })

            it(`responds with 400 'Password must contain at least one number'`, () => {
                const missingNumberPasswordUser = {
                    name: "Good name",
                    email: "goodeamil@good.com",
                    password: 'noNumber'
                }

                return request(app)
                    .post('/api/users/')
                    .send(missingNumberPasswordUser)
                    .expect(400, {
                        error: `Password must contain at least one number`
                    })
            })

            it(`responds with 400 'Email is already in use'`, () => {
                const newUser = {
                    name: "new user",
                    email: "melissa@test.com",
                    password: 'password72'
                }

                return request(app)
                    .post('/api/users/')
                    .send(newUser)
                    .expect(400, {
                        error: `Email is already in use`
                    })
            })
        })

        context(`Happy path`, () => {
            it(`responds with 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    name: "new user",
                    email: "new@user.com",
                    password: 'password720'
                }

                return request(app)
                    .post('/api/users/')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.name).to.eql(newUser.name)
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res => 
                        db
                        .from('users')
                        .select('*')
                        .where({id: res.body.id})
                        .first()
                        .then(row => {
                            expect(row.name).to.eql(newUser.name)
                            expect(row.email).to.eql(newUser.email)                            
                            return bcrypt.compare(newUser.password, row.password)
                        })
                        .then(passwordsMatch => {
                            expect(passwordsMatch).to.be.true
                        })
                    )    
            })
        })
    })
})
