
// Add api tokens and other sensitive info. as needed

module.exports = {
    PORT: process.env.PORT || 8000, // Heroku will assign PORT on deployment
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://knit-mine-admin@localhost/knit-mine-db',
    JWT_SECRET: process.env.JWT_SECRET || 'change this secret',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN //|| 'http://localhost:3000'
};