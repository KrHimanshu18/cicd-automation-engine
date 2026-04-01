const pool = require("./db_config");

class DAL {

    // CREATE PIPELINE
    async insertPipeline(name, status) {
        const query = "INSERT INTO pipelines (name, status) VALUES (?, ?)";
        const [result] = await pool.execute(query, [name, status]);
        return result.insertId;
    }

    // GET ALL PIPELINES
    async getPipelines() {
        const query = "SELECT * FROM pipelines";
        const [rows] = await pool.execute(query);
        return rows;
    }

    // GET SINGLE PIPELINE
    async getPipelineById(id) {
        const query = "SELECT * FROM pipelines WHERE id=?";
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    // UPDATE PIPELINE STATUS
    async updatePipelineStatus(id, status) {
        const query = "UPDATE pipelines SET status=? WHERE id=?";
        await pool.execute(query, [status, id]);
    }

    // CREATE JOB
    async insertJob(pipeline_id, job_name, status, logs) {
        const query = `
            INSERT INTO jobs (pipeline_id, job_name, status, logs)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [pipeline_id, job_name, status, logs]);
        return result.insertId;
    }

    // GET JOBS FOR A PIPELINE
    async getJobs(pipeline_id) {
        const query = "SELECT * FROM jobs WHERE pipeline_id=?";
        const [rows] = await pool.execute(query, [pipeline_id]);
        return rows;
    }

    // UPDATE JOB STATUS
    async updateJobStatus(job_id, status, logs) {
        const query = `
            UPDATE jobs SET status=?, logs=? WHERE id=?
        `;
        await pool.execute(query, [status, logs, job_id]);
    }
}

module.exports = DAL;