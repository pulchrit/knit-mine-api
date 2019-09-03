const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./fixtures')
const helpers = require('./test-helpers')

describe('My Projects Endpoint', () => {
    let db 

    // Create test data.
    const testUsers = fixtures.makeUsersArray()
    const testUser = testUsers[0]
    const testProjectPatterns = fixtures.makeProjectPatternsArray()
    const testStitchPatterns = fixtures.makeStitchPatternsArray()
    const testMyProjects = fixtures.makeMyProjectsArray()
    const projectStitchData = fixtures.makeProjectStitchArray()

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

    describe(`GET & POST /api/my-projects/ and /api/my-projects/:id`, () => {
        
        describe('Protected endpoints for GET', () => {
            
            // Before each and every test in this context, add the data for
            // all tables. Order is important! First users, then project patterns,
            // stitch patterns, my projects, and then the link table for projects to
            // stitches.
            beforeEach('insert all table data', () => 
                helpers.seedAllTables(db, testUsers, testProjectPatterns, testStitchPatterns, testMyProjects, projectStitchData))

            const protectedEndpoints = [
              {
                name: 'GET /api/my-projects/:id',
                path: '/api/my-projects/1',
              },
              {
                name: 'GET /api/my-projects/',
                path: '/api/my-projects/',
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

        describe('Protected endpoint /api/my-projects for POST', () => {
            
            // Before each and every test in this context, add the data for
            // all tables. Order is important! First users, then project patterns,
            // stitch patterns, my projects, and then the link table for projects to
            // stitches.
            beforeEach('insert all table data', () => 
                helpers.seedAllTables(db, testUsers, testProjectPatterns, testStitchPatterns, testMyProjects, projectStitchData))
            
            it(`responds with 401 'Missing JWT bearer token' when no bearer token`, () => {
                return request(app)
                    .post('/api/my-projects/')
                    .expect(401, {error: 'Missing JWT bearer token'})
            })
    
            it('responds 401 "Unauthorized request" when invalid JWT secret', () => {
                const validUser = testUser
                const invalidSecret = 'bad-secret'
                return request(app)
                    .post('/api/my-projects/')
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, {error: `Unauthorized request, incorrect token`})
            })
    
            it('responds with 401 "Unauthorized request" when invalid subject/email in payload', () => {
                const invalidUser = {email: 'user@notright.com', id: 1}
                return request(app)
                    .post('/api/my-projects/')
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, {error: `Unauthorized request, no such user`})
            })
              
        })
          
        context(`Unhappy path, POST /api/my-projects/`, () => {

            // Before each and every test in this context, add the data for
            // all tables. Order is important! First users, then project patterns,
            // stitch patterns, my projects, and then the link table for projects to
            // stitches.
            beforeEach('insert all table data', () => 
                helpers.seedAllTables(db, testUsers, testProjectPatterns, testStitchPatterns, testMyProjects, projectStitchData))
                
            const registerAttemptBody = {
                name: '',
            }

                it(`responds with 400 required error when 'name' is missing`, () => {
                    
                    return request(app)
                        .post('/api/my-projects/')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing 'name' in request body`
                        })
                })
            })

        context('Unhappy path, GET /api/my-projects/:id', () => {
            
            // Before each and every test in this context, add the data for
            // all tables. Order is important! First users, then project patterns,
            // stitch patterns, my projects, and then the link table for projects to
            // stitches.
            beforeEach('insert all table data', () => 
                helpers.seedAllTables(db, testUsers, testProjectPatterns, testStitchPatterns, testMyProjects, projectStitchData))
             
            it(`responds with 404`, () => {
                const patternId = 934
                return request(app)
                  .get(`/api/my-projects/${patternId}`)
                  .set('Authorization', helpers.makeAuthHeader(testUser))
                  .expect(404, { error: `Project doesn't exist` })
            })

            it(`responds with 401`, () => {
                const patternId = 3
                return request(app)
                  .get(`/api/my-projects/${patternId}`)
                  .set('Authorization', helpers.makeAuthHeader(testUser))
                  .expect(401, { error: `This is not one of your projects` })
            })

        })

        context(`Happy path, POST /api/my-projects/`, () => {
            
            // Before each and every test in this context, add the data for
            // all tables. Order is important! First users, then project patterns,
            // stitch patterns, my projects, and then the link table for projects to
            // stitches.
            beforeEach('insert all table data', () => 
                helpers.seedAllTables(db, testUsers, testProjectPatterns, testStitchPatterns, testMyProjects, projectStitchData))
            
            it(`responds with 201, serialized project`, () => {
                const newProject = {
                    name: "Blue's hat",
                    image: "",
                    description: "A hat for a young man",
                    gift_recipient: "Blue",
                    gift_occasion: "Holiday present 2019",
                    yarn: "Cascade Fibers, Superwash 220, Carnival",
                    needles: "US 7, circular",
                    pattern_id: 3,
                    stitches: [1, 5]
                }

                const expectedProject = helpers.makeExpectedProject()

                return request(app)
                    .post('/api/my-projects/')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newProject)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.name).to.eql(expectedProject.name)
                        expect(res.body.description).to.eql(expectedProject.description)
                        expect(res.body.yarn).to.eql(expectedProject.yarn)
                        expect(res.body.needles).to.eql(expectedProject.needles)
                        expect(res.body.pattern_id).to.eql(expectedProject.pattern_id)
                        expect(res.body.patterns).to.eql(expectedProject.patterns)
                        expect(res.body.stitches).to.eql(expectedProject.stitches)
                        expect(res.body.user_id).to-eql(expectedProject.user_id)
                        expect(res.headers.location).to.eql(`/api/my-projects/${res.body.id}`)
                    })
                    .expect(res => 
                        db
                        .from('projects')
                        .select('*')
                        .where({id: res.body.id})
                        .first()
                        .then(row => {
                            expect(row.name).to.eql(expectedProject.name)
                        })
                    )    
            })
        })

        context(`Happy path, GET /api/my-projects/:id`, () => {
            
            // Before each and every test in this context, add the data for
            // all tables. Order is important! First users, then project patterns,
            // stitch patterns, my projects, and then the link table for projects to
            // stitches.
            beforeEach('insert all table data', () => 
                helpers.seedAllTables(db, testUsers, testProjectPatterns, testStitchPatterns, testMyProjects, projectStitchData))
            
            it(`responds with 200 and the project`, () => {
                const expectedProject = helpers.makeExpectedProject()

                return request(app)
                    .get(`/api/my-projects/${expectedProject.id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, expectedProject) 
            })
        })
    })
})