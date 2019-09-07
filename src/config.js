
// Add api tokens and other sensitive info. as needed

module.exports = {
    PORT: process.env.PORT || 8000, // Heroku will assign PORT on deployment
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://knit-mine-admin@localhost/knit-mine-db',
    JWT_SECRET: process.env.JWT_SECRET || 'change this secret',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN, //|| 'http://localhost:3000'
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
};