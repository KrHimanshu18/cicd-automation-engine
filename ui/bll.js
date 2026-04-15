const path = require("path");
const fs = require("fs");
const DAL = require("../dal/database");
const { analyzeFailure } = require("../ai/failure_Analyzer");
const executor = require("../utils/executor"); 

const dal = new DAL();

// ---------------- CREATE PIPELINE ----------------
async function createPipeline(data) {
    const { name, repoUrl, buildCommand, testCommand } = data;

    const id = await dal.insertPipelineWithConfig(
        name,
        repoUrl,
        buildCommand,
        testCommand
    );

    console.log("Created Pipeline ID:", id);
    return id;
}

// ---------------- GET ALL PIPELINES ----------------
async function getAllPipelines() {
    return await dal.getPipelines();
}

// ---------------- PROCESS PIPELINE ----------------
async function processPipeline(pipelineId) {
    try {
        const pipeline = await dal.getPipelineById(pipelineId);

        if (!pipeline) {
            return { status: "FAILED", stage: "CLONE" };
        }

        const { repo_url, build_command, test_command } = pipeline;

        const baseDir = path.join(__dirname, "..", "repos");
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir);
        }

        const repoDir = path.join(baseDir, `pipeline_${pipelineId}`);

        // Clean previous repo
        if (fs.existsSync(repoDir)) {
            fs.rmSync(repoDir, { recursive: true, force: true });
        }

        // -------- CLONE --------
        try {
            await executor.runCommand(`git clone ${repo_url} ${repoDir}`);
        } catch (err) {
            return { status: "FAILED", stage: "CLONE" };
        }

        // -------- BUILD --------
        try {
            console.log("[BUILD] Running:", build_command);

            await executor.runCommand(build_command, repoDir);

            console.log("[BUILD] Success");

        } catch (err) {

            console.log("[BUILD] Failed");
            console.log("[ERROR]", err.toString());

            console.log("[AI] Analyzing failure...");
            const analysis = analyzeFailure(err.toString());

            console.log("[AI] Suggestion:", analysis.suggestion);
            console.log("[AI] Fix Command:", analysis.fixCommand);

            if (analysis.fixCommand && analysis.fixCommand !== build_command) {
                try {
                    console.log("[RETRY] Retrying BUILD with:", analysis.fixCommand);

                    await executor.runCommand(analysis.fixCommand, repoDir);

                    console.log("[BUILD] Retry successful");

                } catch (retryErr) {
                    console.log("[RETRY] Retry failed");
                    console.log("[ERROR]", retryErr.toString());

                    return { status: "FAILED", stage: "BUILD" };
                }
            } else {
                console.log("[AI] ⚠ No valid fix found. Skipping retry.");

                return { status: "FAILED", stage: "BUILD" };
            }
        }

        // -------- TEST --------
        try {
            console.log("[TEST] Running:", test_command);

            await executor.runCommand(test_command, repoDir);

            console.log("[TEST] Success");

        } catch (err) {

            console.log("[TEST] Failed");
            console.log("[ERROR]", err.toString());

            console.log("[AI] Analyzing failure...");
            const analysis = analyzeFailure(err.toString());

            console.log("[AI] Suggestion:", analysis.suggestion);
            console.log("[AI] Fix Command:", analysis.fixCommand);

            if (analysis.fixCommand && analysis.fixCommand !== test_command) {
                try {
                    console.log("[RETRY] Retrying TEST with:", analysis.fixCommand);

                    await executor.runCommand(analysis.fixCommand, repoDir);

                    console.log("[TEST] Retry successful");

                } catch (retryErr) {
                    console.log("[RETRY] Retry failed");
                    console.log("[ERROR]", retryErr.toString());

                    return { status: "FAILED", stage: "TEST" };
                }
            } else {
                console.log("[AI] ⚠ No valid fix found. Skipping retry.");

                return { status: "FAILED", stage: "TEST" };
            }
        }

        // -------- DEPLOY --------
        return {
            status: "SUCCESS",
            stage: "DEPLOY"
        };

    } catch (err) {
        console.error("Pipeline execution error:", err.message);
        throw err;
    }
}

module.exports = {
    createPipeline,
    processPipeline,
    getAllPipelines
};