# Knit Mine API

## Endpoints

### Registering a user: /api/users/ 
Validates proper parameters have been submitted and adds the user to the database. 

HTTP Request: POST

Parameters: 
- name, required
- email, required, will be used as user name for login
- password, required, 8+ chars, including one number

Errors: 
- 400, `Missing 'name/email/password' in request body`
- 400, `Password must be between 8 and 72 characters long`
- 400, `Password must contain at least one number`
- 400, `Email is already in use`

Success: 
- 201
```
{"id":3,"name":"Demo","email":"demo@demo.com"}
```

### Authenticating a user: /api/auth/login
Ensures valid email and password have been supplied. Response contains a JWT Auth Token to include with all future requests to protected endpoints (i.e., /my-projects, /stitch-patterns, /project-patterns).

HTTP Request: POST

Parameters: 
- email, required
- password, required

Errors: 
- 400, `Missing 'email/password' in request body`
- 400, `Incorrect email or password`

Success: 
- 200
```{"authToken":"<JWT Auth Token will appear here>"}```

### Viewing all stitches by user: /api/stitch-patterns/
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view all of their stitch patterns.

HTTP Request: GET

Headers: 
- Authorization header with JWT Auth Token for this user. `"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - None, user id will be acquired from JWT Auth Token

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`

Success: 
- 200
```{
    "id":7,
    "name":"Daisy Stitch",
    "url":"https://www.knittingstitchpatterns.com/2014/08/daisy-stitch.html",
    "image_url":"https://4.bp.blogspot.com/-S_HevcA4TPY/Vh5RytTPbJI/AAAAAAAAKfw/d2VdcpOXK_c/s1600/Daisy%2Bknitting%2BStitch.jpg",
    "notes":"Remember to knit loosely!","user_id":3
}```
- Empty array will be returned if users has not saved any stitch patterns.


### Viewing and adding stitches: /api/stitch-patterns/, /api/stitch-patterns/:id,
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view all of their stitch patterns or an individual stitch pattern by id. 
- Allows a user to add a stitch pattern to the database under their user id. 

HTTP Request: GET, POST

Headers: 
- Authorization header with JWT Auth Token for this user.

Parameters: 
 - None, user id will be acquired from JWT Auth Token

Errors: 
- 400, `Missing 'email/password' in request body`
- 400, `Incorrect email or password`

Success: 
- 200
```{"authToken":"<JWT Auth Token will appear here>"}```
## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Deploy the application `npm run deploy`

## Server location

This server is deployed on Heroku at https://quiet-shelf-50620.herokuapp.com/ and uses a PostgreSQL database also deployed on Heroku. 