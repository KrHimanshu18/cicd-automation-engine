require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'testdb';
const DB_PORT = process.env.DB_PORT || 3306;

async function initDB() {
    try {
        // Create DB if not exists
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        console.log(`Database '${DB_NAME}' ensured`);

        await connection.end();

        // Create pool
        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            port: DB_PORT
        });

        // Create tables
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pipelines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                repo_url TEXT,
                build_command TEXT,
                test_command TEXT,
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pipeline_id INT,
                job_name VARCHAR(100),
                status VARCHAR(50),
                logs LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Tables initialized");

    } catch (err) {
        console.error("DB Init Error:", err.message);
        throw err;
    }
}

// REQUIRED FOR TEST CLEANUP
function getPool() {
    return pool;
}

module.exports = {
    initDB,
    getPool
};