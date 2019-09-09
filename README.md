# Knit Mine API

## Endpoints

### Registering a user
Endpoint: /api/users/ 

HTTP Request: POST

Parameters: 
- name: required
- email: required, will be used as user name for login
- password: required, 8+ chars, including one number

Errors: 
- 400, Missing required field
- 400, Password must be 8-72 characters and contian one number

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Deploy the application `npm run deploy`

## Server location

This server is deployed on Heroku at https://quiet-shelf-50620.herokuapp.com/ and uses a PostgreSQL database also deployed on Heroku. 