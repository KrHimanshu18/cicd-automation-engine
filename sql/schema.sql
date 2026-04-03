CREATE DATABASE IF NOT EXISTS cicd_engine;
USE cicd_engine;

CREATE TABLE IF NOT EXISTS pipelines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pipeline_id INT,
    job_name VARCHAR(100),
    status VARCHAR(50),
    logs TEXT,
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(id)
);