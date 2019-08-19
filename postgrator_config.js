require ('dotenv').config();

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "host": "process.env.MIGRATION_DB_HOST",
    "port": "process.env.MIGRATION_DB_PORT",
    "database": "process.env.MIGRATION_DB_NAME",
    "database": "process.env.MIGRATION_DB_USER",
    "username": "process.env.MIGRATION_DB_PASS"
}