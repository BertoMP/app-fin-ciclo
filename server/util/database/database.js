const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'clinica',
    timezone: process.env.DB_TIMEZONE || 'Z',
});

module.exports = pool.promise();
