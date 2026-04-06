const { getPool } = require("./db_config");

class DAL {

    // CREATE PIPELINE WITH CONFIG
    async insertPipelineWithConfig(name, repoUrl, buildCommand, testCommand, status = "CREATED") {
        try {
            const pool = getPool();
            const query = `
                INSERT INTO pipelines (name, repo_url, build_command, test_command, status)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await pool.execute(query, [
                name,
                repoUrl,
                buildCommand,
                testCommand,
                status
            ]);
            return result.insertId;
        } catch (err) {
            console.error("DAL insertPipelineWithConfig error:", err.message);
            throw err;
        }
    }

    // GET ALL PIPELINES
    async getPipelines() {
        try {
            const pool = getPool();
            const [rows] = await pool.execute("SELECT * FROM pipelines");
            return rows;
        } catch (err) {
            console.error("DAL getPipelines error:", err.message);
            throw err;
        }
    }

    // UPDATE PIPELINE STATUS
    async updatePipelineStatus(id, status) {
        try {
            const pool = getPool();
            await pool.execute(
                "UPDATE pipelines SET status=? WHERE id=?",
                [status, id]
            );
        } catch (err) {
            console.error("DAL updatePipelineStatus error:", err.message);
            throw err;
        }
    }

    // CREATE JOB
    async insertJob(pipeline_id, job_name, status, logs = "") {
        try {
            const pool = getPool();
            const query = `
                INSERT INTO jobs (pipeline_id, job_name, status, logs)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await pool.execute(query, [
                pipeline_id,
                job_name,
                status,
                logs
            ]);
            return result.insertId;
        } catch (err) {
            console.error("DAL insertJob error:", err.message);
            throw err;
        }
    }

    async getPipelineById(id) {
        const pool = getPool();
        const [rows] = await pool.execute(
            "SELECT * FROM pipelines WHERE id=?",
            [id]
        );
        return rows[0];
    }

}

module.exports = DAL;