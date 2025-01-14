// backend/src/config/db.js
// Database connection
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const HOST = process.env.HOST
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD
const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

const { Pool } = require('pg');

const pool = new Pool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    port: PORT,
    database: DATABASE,
})

module.exports = {pool};