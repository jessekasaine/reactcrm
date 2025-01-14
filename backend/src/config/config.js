// backend/src/config/config.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const HOST = process.env.HOST
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD
const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '24h',
    db: {
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE,
        port: PORT,
    },
    server: {
        port: process.env.PORT || 3000,
    }
};