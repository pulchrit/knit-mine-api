const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./fixtures')
const helpers = require('./test-helpers')

describe.only('Stitch-Patterns Endpoint', () => {
    let db 

    // Create test data.
    const testUsers = fixtures.makeUsersArray()
    const testUser = testUsers[0]
    const testStitchPatterns = fixtures.makeStitchPatternsArray()
    const testStitchPattern = testStitchPatterns[0]


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

    describe(`GET & POST /api/stitch-patterns/ and /api/stitch-patterns/:id`, () => {
        
        describe('Protected endpoints for GET', () => {
            
            // Before each and every test in this context, add the data.
            // Users must be added before anything else because all other 
            // tables depend on Users table.
            beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
            beforeEach('insert stitch patterns', () => helpers.seedStitchPatterns(db, testStitchPatterns))
        
            const protectedEndpoints = [
              {
                name: 'GET /api/stitchPatterns/:id',
                path: '/api/stitch-patterns/1',
              },
              {
                name: 'GET /api/stitchPatterns/',
                path: '/api/stitch-patterns/',
              }
            ]
        
            protectedEndpoints.forEach(endpoint => {
              describe(endpoint.name, () => {
                it(`responds with 401 'Missing JWT bearer token' when no bearer token`, () => {
                  return request(app)
                    .get(endpoint.path)
                    .expect(401, {error: 'Missing JWT bearer token'})
                })
        
                it('responds 401 "Unauthorized request" when invalid JWT secret', () => {
                  const validUser = testUser
                  const invalidSecret = 'bad-secret'
                  return request(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {error: `Unauthorized request, incorrect token`})
                })
        
                it('responds with 401 "Unauthorized request" when invalid subject/email in payload', () => {
                  const invalidUser = {email: "user@notright.com", id: 1}
                  return request(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {error: `Unauthorized request, no such user`})
                })
              })
            })  
        })

        describe('Protected endpoint /api/stitch-patterns for POST', () => {
            
            // Before each and every test in this context, add the data.
            // Users must be added before anything else because all other 
            // tables depend on Users table.
            beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
            beforeEach('insert stitch patterns', () => helpers.seedStitchPatterns(db, testStitchPatterns))
        
            it(`responds with 401 'Missing JWT bearer token' when no bearer token`, () => {
                return request(app)
                    .post('/api/stitch-patterns/')
                    .expect(401, {error: 'Missing JWT bearer token'})
            })
    
            it('responds 401 "Unauthorized request" when invalid JWT secret', () => {
                const validUser = testUser
                const invalidSecret = 'bad-secret'
                return request(app)
                    .post('/api/stitch-patterns/')
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {error: `Unauthorized request, incorrect token`})
            })
    
            it('responds with 401 "Unauthorized request" when invalid subject/email in payload', () => {
                const invalidUser = {email: 'user@notright.com', id: 1}
                return request(app)
                    .post('/api/stitch-patterns/')
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {error: `Unauthorized request, no such user`})
            })
              
        })
          
        context(`Unhappy path, POST /api/stitch-patterns/`, () => {

            // Before each and every test in this context, add the data.
            // Users must be added before anything else because all other 
            // tables depend on Users table.
            beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
            beforeEach('insert stitch patterns', () => helpers.seedStitchPatterns(db, testStitchPatterns))

            const requiredFields = ['name', 'url']

            requiredFields.forEach(field => {
                
                const registerAttemptBody = {
                    name: testStitchPattern.name,
                    url: testStitchPattern.url,
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    
                    // Delete one of the fields on each iteration to test when it's missing.
                    delete registerAttemptBody[field]

                    return request(app)
                        .post('/api/stitch-patterns/')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                })
            })

        })

        context('Unhappy path, GET /api/stitch-patterns/:id', () => {
            
            // Before each and every test in this context, add the data.
            // Users must be added before anything else because all other 
            // tables depend on Users table.
            beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
            beforeEach('insert stitch patterns', () => helpers.seedStitchPatterns(db, testStitchPatterns))
 
            it(`responds with 404`, () => {
                const patternId = 934
                return request(app)
                  .get(`/api/stitch-patterns/${patternId}`)
                  .set('Authorization', helpers.makeAuthHeader(testUser))
                  .expect(404, { error: `Pattern doesn't exist` })
              })
        })

        context(`Happy path, POST /api/stitch-patterns/`, () => {
            
            // Before each and every test in this context, add the data.
            // Users must be added before anything else because all other 
            // tables depend on Users table.
            beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
            // Won't insert patterns here to avoid issues with duplicate pattern ids.

            it(`responds with 201, serialized pattern`, () => {
                const newPattern = {
                    id: 1,
                    name: "Andalusian Stitch",
                    url: "https://www.simple-knitting.com/andalusian-stitch.html",                    image_url: "https://images.squarespace-cdn.com/content/v1/543bf675e4b08a84cfe5ef60/1556313487737-YO00LSXYZVBOGQHE1HUC/ke17ZwdGBToddI8pDm48kFjKEMmEDO_b2ODc1-UFY4hZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVEdKrS--dBBXSNpbOi8h72cTsZ1cKPviRDH_4C971HR4ICPln5w6c1OVbkRIeOvONs/sunny+blanket.jpg?format=1000w",
                    notes: "Simple to work, but has a warm, comforting appearance",
                    user_id: 1
                }

                return request(app)
                    .post('/api/stitch-patterns/')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newPattern)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.name).to.eql(newPattern.name)
                        expect(res.body.url).to.eql(newPattern.url)
                        expect(res.body.image_url).to.eql(newPattern.image_url)
                        expect(res.body.notes).to.eql(newPattern.notes)
                        expect(res.headers.location).to.eql(`/api/stitch-patterns/${res.body.id}`)
                    })
                    .expect(res => 
                        db
                        .from('stitches')
                        .select('*')
                        .where({id: res.body.id})
                        .first()
                        .then(row => {
                            expect(row.name).to.eql(newPattern.name)
                            expect(row.url).to.eql(newPattern.url)                            
                        })
                    )    
            })
        })

        context(`Happy path, GET /api/stitch-patterns/:id`, () => {
            
            // Before each and every test in this context, add the data.
            // Users must be added before anything else because all other 
            // tables depend on Users table.
            beforeEach('insert users', () => helpers.seedUsers(db, testUsers))
            beforeEach('insert stitch patterns', () => helpers.seedStitchPatterns(db, testStitchPatterns))
            
            it(`responds with 200 and the pattern`, () => {
                const expectedPattern = testStitchPattern

                return request(app)
                    .get(`/api/stitch-patterns/${expectedPattern.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedPattern) 
            })
        })
    })
})