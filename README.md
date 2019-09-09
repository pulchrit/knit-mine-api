# Knit Mine API

## Endpoints

### Registering a user: /api/users/ 

HTTP Request: POST

Parameters: 
- name: required
- email: required, will be used as user name for login
- password: required, 8+ chars, including one number

Errors: 
- 400, `Missing 'name/email/password' in request body`
- 400, `Password must be between 8 and 72 characters long`
- 400, `Password must contain at least one number`
- 400, `Email is already in use`

Success: 
HTTP Status: 201
```
{"id":3,"name":"Demo","email":"demo@demo.com"}
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Deploy the application `npm run deploy`

## Server location

This server is deployed on Heroku at https://quiet-shelf-50620.herokuapp.com/ and uses a PostgreSQL database also deployed on Heroku. 