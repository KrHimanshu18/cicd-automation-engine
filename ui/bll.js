const DAL = require("../dal/database");
const { runCommand } = require("../utils/executor");
const fs = require("fs");

const dal = new DAL();

// ---------------- CREATE PIPELINE ----------------
async function createPipeline(data) {
    try {
        const { name, repoUrl, buildCommand, testCommand } = data;

        if (!name || !repoUrl) {
            throw new Error("name and repoUrl are required");
        }

        const pipelineId = await dal.insertPipelineWithConfig(
            name,
            repoUrl,
            buildCommand,
            testCommand,
            "CREATED"
        );

        return pipelineId;

    } catch (err) {
        console.error("BLL createPipeline error:", err.message);
        throw err;
    }
}

// ---------------- GET ALL PIPELINES ----------------
async function getAllPipelines() {
    try {
        return await dal.getPipelines();
    } catch (err) {
        console.error("BLL getAllPipelines error:", err.message);
        throw err;
    }
}

// ---------------- PROCESS PIPELINE (REAL EXECUTION) ----------------
async function processPipeline(pipelineId) {

    try {
        const pipeline = await dal.getPipelineById(pipelineId);

        if (!pipeline) throw new Error("Pipeline not found");

        // Safe extraction
        const repo_url = pipeline.repo_url;
        const build_command = pipeline.build_command || "npm install";
        const test_command = pipeline.test_command || "npm test";

        await dal.updatePipelineStatus(pipelineId, "RUNNING");

        const folder = `repos/pipeline_${pipelineId}`;

        // ---------------- CLONE ----------------
        try {
            // Clean old folder if exists
            if (fs.existsSync(folder)) {
                fs.rmSync(folder, { recursive: true, force: true });
            }

            const cloneLog = await runCommand(`git clone ${repo_url} ${folder}`);
            await dal.insertJob(pipelineId, "Clone", "SUCCESS", cloneLog);

        } catch (err) {
            await dal.insertJob(pipelineId, "Clone", "FAILED", err.toString());
            await dal.updatePipelineStatus(pipelineId, "FAILED");

            return { status: "FAILED", stage: "CLONE", error: err.toString() };
        }

        // ---------------- BUILD ----------------
        try {
            const buildLog = await runCommand(build_command, folder);
            await dal.insertJob(pipelineId, "Build", "SUCCESS", buildLog);

        } catch (err) {
            await dal.insertJob(pipelineId, "Build", "FAILED", err.toString());
            await dal.updatePipelineStatus(pipelineId, "FAILED");

            return { status: "FAILED", stage: "BUILD", error: err.toString() };
        }

        // ---------------- TEST ----------------
        try {
            const testLog = await runCommand(test_command, folder);
            await dal.insertJob(pipelineId, "Test", "SUCCESS", testLog);

        } catch (err) {
            await dal.insertJob(pipelineId, "Test", "FAILED", err.toString());
            await dal.updatePipelineStatus(pipelineId, "FAILED");

            return { status: "FAILED", stage: "TEST", error: err.toString() };
        }

        // ---------------- DEPLOY ----------------
        await dal.insertJob(
            pipelineId,
            "Deploy",
            "SUCCESS",
            "Deployment completed"
        );

        await dal.updatePipelineStatus(pipelineId, "SUCCESS");

        return { status: "SUCCESS", stage: "DEPLOY" };

    } catch (err) {
        console.error("Pipeline execution error:", err.message);
        throw err;
    }
}

// ---------------- AI FAILURE CLASSIFICATION ----------------
function classifyFailure(logMessage) {
    if (!logMessage) return "Unknown Failure";

    const msg = logMessage.toLowerCase();

    if (msg.includes("test")) return "Test Failure";
    if (msg.includes("deploy")) return "Deployment Failure";
    if (msg.includes("runtime")) return "Runtime Failure";
    if (msg.includes("module")) return "Dependency Error";

    return "Unknown Failure";
}

// ---------------- RECOVERY LOGIC ----------------
async function getRecoveryAction(pipelineId, failureType) {
    try {
        let action;

        if (failureType === "Test Failure") action = "Retry Build";
        else if (failureType === "Deployment Failure") action = "Rollback Deployment";
        else if (failureType === "Dependency Error") action = "Run npm install";
        else action = "Restart Service";

        await dal.updatePipelineStatus(pipelineId, "RECOVERY_TRIGGERED");

        return { action };

    } catch (err) {
        console.error("BLL getRecoveryAction error:", err.message);
        throw err;
    }
}

// ---------------- NOTIFICATION ----------------
function generateNotification(message) {
    return `NOTIFICATION: ${message}`;
}

module.exports = {
    createPipeline,
    getAllPipelines,
    processPipeline,
    classifyFailure,
    getRecoveryAction,
    generateNotification
};