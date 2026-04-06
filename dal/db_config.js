require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'testdb';
const DB_PORT = process.env.DB_PORT || 3306;

let pool;

// Initialize DB (CREATE DATABASE + TABLES)
async function initDB() {
    try {
        // Step 1: Connect WITHOUT database
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT
        });

        // Step 2: Create database if not exists
        await connection.execute(
            `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``
        );

        console.log(`Database '${DB_NAME}' ensured`);

        await connection.end();

        // Step 3: Create pool WITH database
        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            port: DB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Step 4: Create tables
        const conn = await pool.getConnection();

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS pipelines (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                repo_url TEXT,
                build_command TEXT,
                test_command TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pipeline_id INT,
                job_name VARCHAR(255),
                status VARCHAR(50),
                logs TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (pipeline_id) REFERENCES pipelines(id) ON DELETE CASCADE
            )
        `);

        conn.release();

        console.log("Tables initialized");

    } catch (err) {
        console.error("DB Init Error:", err.message);
        throw err;
    }
}

// Export getter (important because pool is initialized later)
function getPool() {
    if (!pool) {
        throw new Error("Pool not initialized. Call initDB() first.");
    }
    return pool;
}

module.exports = { initDB, getPool };