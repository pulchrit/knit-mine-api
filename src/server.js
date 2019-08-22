const knex = require('knex')
const app = require('./app');
const { PORT, DB_URL } = require('./config');

// Get database instance using knex with postgres pg driver.
// Pull DB_URL from .config file (it will be heroku postgres db in prod and localhost db in dev).
const db = knex({
    client: 'pg',
    connection: DB_URL,
  })
  
// Save the database to this express app instance. 
app.set('db', db)

// Set the app to listen on prod or dev port
app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
});



