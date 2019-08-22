process.env.NODE_ENV = 'test'

require('dotenv').config()
const expect = require('chai').expect;
const request = require('supertest');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-test-testy'

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || "postgresql://knit-mine-admin@localhost/knit-mine-db-test"

global.expect = expect;
global.request = request;



