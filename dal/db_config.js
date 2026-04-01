const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "hrishi@1998", 
    database: "cicd_engine",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;