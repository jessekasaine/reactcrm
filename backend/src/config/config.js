// backend/src/config/config.js
require('dotenv').config();


module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '24h',
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    },
    server: {
        port: process.env.PORT || 3000,
    }
};