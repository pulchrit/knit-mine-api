# Knit Mine API

Node Express Server using PostgreSQL database. 

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
```
{"authToken":"<JWT Auth Token will appear here>"}
```

### Viewing all stitches by user: /api/stitch-patterns/
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view all of their stitch patterns.

HTTP Request: GET

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - None, user id will be acquired from JWT Auth Token

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`

Success: 
- 200

```
[
    {
        "id":7,
        "name":
        "Daisy Stitch",
        "url":"https://www.knittingstitchpatterns.com/2014/08/daisy-stitch.html",
        "image_url":"https://4.bp.blogspot.com/-S_HevcA4TPY/Vh5RytTPbJI/AAAAAAAAKfw/d2VdcpOXK_c/s1600/Daisy%2Bknitting%2BStitch.jpg",
        "notes":"Remember to knit loosely!",
        "user_id":3
    },
    {...},
    {...}
]
```
- Empty array will be returned if users has not saved any stitch patterns.


### Adding a stitch by user: /api/stitch-patterns/
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows a user to add a stitch pattern to the database under their user id. 

HTTP Request: POST

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - name, required, a name for this stitch
 - url, required, link to the webpage for this stitch
 - image_url, link to the image for this stitch
 - notes, any notes the user wants to include
 - (User id will be acquired from JWT Auth Token)

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`
- 400, `Missing 'name/url' in request body`

Success: 
- 201

```
{
    "id":7,
    "name":"Daisy Stitch",
    "url":"https://www.knittingstitchpatterns.com/2014/08/daisy-stitch.html",
    "image_url":"https://4.bp.blogspot.com/-S_HevcA4TPY/Vh5RytTPbJI/AAAAAAAAKfw/d2VdcpOXK_c/s1600/Daisy%2Bknitting%2BStitch.jpg",
    "notes":"Remember to knit loosely!",
    "user_id":3
}
```

### Viewing a stitch by user and stitch id: /api/stitch-patterns/:id
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view an individual stitch pattern by id. 

HTTP Request: GET

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - Stitch pattern id param from route/path. For example: 
 `https://knit-mine-app/now.sh/stitch-patterns/7`

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`
- 404, `Pattern doesn't exist`
- 401, `This is not one of your stitches.`

Success: 
- 200
```
{
    "id":7,
    "name":"Daisy Stitch",
    "url":"https://www.knittingstitchpatterns.com/2014/08/daisy-stitch.html",
    "image_url":"https://4.bp.blogspot.com/-S_HevcA4TPY/Vh5RytTPbJI/AAAAAAAAKfw/d2VdcpOXK_c/s1600/Daisy%2Bknitting%2BStitch.jpg",
    "notes":"Remember to knit loosely!",
    "user_id":3
}
```

### Viewing all project patterns by user: /api/project-patterns/
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view all of their project patterns.

HTTP Request: GET

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - None, user id will be acquired from JWT Auth Token

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`

Success: 
- 200

```
[
    {
        "id":2,
        "name":"Mossy jacket",
        "url":"http://fpea.blogspot.com/2007/01/free-pattern-friday-mossy-jacket.html",
        "image_url":"http://farm1.static.flickr.com/134/345404969_719fcb4965.jpg",
        "notes":"No seaming! It's knit in the round!",
        "yarn":"Worsted",
        "needles":"US 9, US 10",
        "user_id":3
    },
    {...},
    {...}
]
```
- Empty array will be returned if users has not saved any project patterns.


### Adding a project pattern by user: /api/project-patterns/
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows a user to add a project pattern to the database under their user id. 

HTTP Request: POST

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - name, required, a name for this project pattern
 - url, required, link to the webpage for this project pattern
 - image_url, link to the image for this project pattern
 - notes, any notes the user wants to include
 - yarn, the yarn type
 - needles, the needle size and/or type
 - (user_id will be acquired from JWT Auth Token)

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`
- 400, `Missing 'name/url' in request body`

Success: 
- 201

```
{
    "id":2,
    "name":"Mossy jacket",
    "url":"http://fpea.blogspot.com/2007/01/free-pattern-friday-mossy-jacket.html",
    "image_url":"http://farm1.static.flickr.com/134/345404969_719fcb4965.jpg",
    "notes":"No seaming! It's knit in the round!",
    "yarn":"Worsted",
    "needles":"US 9, US 10",
    "user_id":3
}
```

### Viewing a project pattern by user and project pattern id: /api/project-patterns/:id
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view an individual project pattern by id. 

HTTP Request: GET

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - Project pattern id param from route/path. For example: 
 `https://knit-mine-app/now.sh/project-patterns/2`

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`
- 404, `Pattern doesn't exist`
- 401, `This is not one of your project patterns.`

Success: 
- 200
```
{
    "id":2,
    "name":"Mossy jacket",
    "url":"http://fpea.blogspot.com/2007/01/free-pattern-friday-mossy-jacket.html",
    "image_url":"http://farm1.static.flickr.com/134/345404969_719fcb4965.jpg",
    "notes":"No seaming! It's knit in the round!",
    "yarn":"Worsted",
    "needles":"US 9, US 10",
    "user_id":3
}
```

### Viewing all user projects by user: /api/my-projects/
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view all of their own projects.
- No stitch information or project pattern link will be returned for this view. It is only in the individual project view (i.e., /ap/my-projects/:id) where links to patterns and stitches will be included in the response.

HTTP Request: GET

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - None, user id will be acquired from JWT Auth Token

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`

Success: 
- 200

```
[
    {
        "id":1,
        "name":"Blanket for Ada",
        "image":"https://knit-mine-uploads.s3.amazonaws.com/7c3bbf48-cfb6-4289-924e-3ff17a082223.jpeg",
        "description":"Beautiful blanket.",
        "gift_recipient":"Ada",
        "gift_occasion":"Birth 2014",
        "yarn":"Cascade 220, chunky, sunrise",
        "needles":"US 8",
        "pattern_id":1,
        "user_id":5
    },
    {...},
    {...}
]
```
- Empty array will be returned if users has not saved any of their own projects.


### Adding a project by user: /api/my-projects/
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows a user to add one of their own projects to the database under their user id. 
- User uploaded images will be stored in an AWS S3 bucket for the Knit-Mine-API and a url to each image will be supplied before the add project form is submitted. This ensures the image url is uploaded to the database along with the other project information. A special route was created for this S3 upload, see /sign-s3 below.

HTTP Request: POST

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - name, required, a name for this project 
 - image, link to AWS S3 bucket for this image 
 - description, description of the project
 - gift_recipient, person to recieve the gift
 - gift_occasion, the occasion for the gift
 - yarn, the yarn type
 - needles, the needle size and/or type
 - pattern_id, id of pattern (from drop down, select input)
 - stitches, array of stitch ids (from drop down, multi-select input)
 - (User id will be acquired from JWT Auth Token)

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`
- 400, `Missing 'name' in request body`

Success: 
- 201

```
{
    "id":4,
    "name":"Hat for Ezzie",
    "image":"https://knit-mine-uploads.s3.amazonaws.com/eb3faf81-06b5-40e9-9aea-96f75aaf492f.jpeg",
    "description":"A warm hat for my dear. ",
    "gift_recipient":"Ezzie",
    "gift_occasion":"Birthday 2018",
    "yarn":"Cascade, sunrise",
    "needles":"US 7",
    "pattern_id":1,
    "stitches":[1,4],
    "user_id":5,
    "pattern":
        {
            "pattern_id":1,
            "pattern_name":"Rose Garden Scarf"
        }
}
```

### Viewing a user's own project by project id: /api/my-projects/:id
- Ensures user is logged in by checking for valid JWT Auth Token in header. 
- Allows user to view one of their own projects by id. 

HTTP Request: GET

Headers: 
- Authorization header with JWT Auth Token for this user. For example: 
`"Authorization": "bearer <JWT Auth Token here>"`

Parameters: 
 - Project id param from route/path. For example: 
 `https://knit-mine-app/now.sh/my-projects/4`

Errors: 
- 401, `Missing JWT bearer token`
- 401, `Unauthorized request, no such user`
- 401, `Unauthorized request, incorrect token`
- 404, `Project doesn't exist`
- 401, `This is not one of your projects.`

Success: 
- 200
```
{
    "id":4,
    "name":"Hat for Ezzie",
    "image":"https://knit-mine-uploads.s3.amazonaws.com/eb3faf81-06b5-40e9-9aea-96f75aaf492f.jpeg",
    "description":"A warm hat for my dear. ",
    "gift_recipient":"Ezzie",
    "gift_occasion":"Birthday 2018",
    "yarn":"Cascade, sunrise",
    "needles":"US 7",
    "pattern_id":1,
    "stitches":
        [
            {
                "stitches_id":1,
                "stitches_name":"Herringbone"
            }, 
            {
                "stitches_id":4,
                "stitches_name":"Daisy stitch"
            }
        ],
    "user_id":5,
    "pattern":
        {
            "pattern_id":1,
            "pattern_name":"Rose Garden Scarf"
        }
}
```

### Uploading a user image file to AWS S3 Bucket: /sign-s3
- This endpoint is only called as part of the /api/my-projects/ POST endpoint. 
- It is called and must complete BEFORE the add-project form is submitted to /api/my-projects/ endpoint using POST. Premature sumbission is prevented by the disabling of the form's submit button until the S3 image url is returned and saved to state in the React form. 
- It first gets a signed request that is attached to the image and then the image file is uploaded to the knit-mine-uploads bucket on S3. 

HTTP Request: GET

Parameters: 
- File to be uploaded

Success: 
- 200
```
{
    "signedRequest":"<S3 signed request will appear here",
    "url":"https://knit-mine-uploads.s3.amazonaws.com/eb3faf81-06b5-40e9-9aea-96f75aaf492f.jpeg"
}
```


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Deploy the application `npm run deploy`

## Server location

This server is deployed on Heroku at https://quiet-shelf-50620.herokuapp.com/ and uses a PostgreSQL database also deployed on Heroku. 