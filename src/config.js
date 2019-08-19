
// Add api tokens and other sensitive info. as needed

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://knit-mine-admin@localhost/knit-mine-db',
    JWT_SECRET: process.env.JWT_Secret || 'rural urban strays likely'
};