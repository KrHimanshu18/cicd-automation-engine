const path = require("path");
const fs = require("fs");
const DAL = require("../dal/database");
const { analyzeFailure } = require("../ai/failure_Analyzer");
const executor = require("../utils/executor");

const dal = new DAL();

// store fixes temporarily (in-memory)
let lastFix = {};

// ---------------- CREATE PIPELINE ----------------
async function createPipeline(data) {
    const { name, repoUrl, buildCommand, testCommand } = data;

    const id = await dal.insertPipelineWithConfig(
        name,
        repoUrl,
        buildCommand,
        testCommand
    );

    return id;
}

// ---------------- PROCESS PIPELINE ----------------
async function processPipeline(pipelineId) {
    let logs = [];

    function log(msg) {
        console.log(msg);
        logs.push(msg);
    }

    const pipeline = await dal.getPipelineById(pipelineId);

    if (!pipeline) {
        return { status: "FAILED", stage: "CLONE", logs };
    }

    const { repo_url, build_command, test_command } = pipeline;

    const repoDir = path.join(__dirname, "..", "repos", `pipeline_${pipelineId}`);

    if (fs.existsSync(repoDir)) {
        fs.rmSync(repoDir, { recursive: true, force: true });
    }

    // -------- CLONE --------
    try {
        log("[CLONE] Running...");
        await executor.runCommand(`git clone ${repo_url} ${repoDir}`);
        log("[CLONE] Success");
    } catch (err) {
        log("[CLONE] Failed");
        return { status: "FAILED", stage: "CLONE", logs };
    }

    // -------- BUILD --------
    try {
        log("[BUILD] Running: " + build_command);
        await executor.runCommand(build_command, repoDir);
        log("[BUILD] Success");
    } catch (err) {
        log("[BUILD] Failed");

        const analysis = analyzeFailure(err.toString());

        log("[AI] Type: " + analysis.type);
        log("[AI] Suggestion: " + analysis.suggestion);
        log("[AI] Fix Command: " + analysis.fixCommand);

        lastFix[pipelineId] = {
            stage: "BUILD",
            command: analysis.fixCommand
        };

        return {
            status: "FAILED",
            stage: "BUILD",
            fixCommand: analysis.fixCommand,
            logs
        };
    }

    // -------- TEST --------
    try {
        log("[TEST] Running: " + test_command);
        await executor.runCommand(test_command, repoDir);
        log("[TEST] Success");
    } catch (err) {
        log("[TEST] Failed");

        const analysis = analyzeFailure(err.toString());

        log("[AI] Type: " + analysis.type);
        log("[AI] Suggestion: " + analysis.suggestion);
        log("[AI] Fix Command: " + analysis.fixCommand);

        lastFix[pipelineId] = {
            stage: "TEST",
            command: analysis.fixCommand
        };

        return {
            status: "FAILED",
            stage: "TEST",
            fixCommand: analysis.fixCommand,
            logs
        };
    }

    return {
        status: "SUCCESS",
        stage: "DEPLOY",
        logs
    };
}

// ---------------- RETRY PIPELINE ----------------
async function retryPipeline(pipelineId) {
    let logs = [];

    function log(msg) {
        console.log(msg);
        logs.push(msg);
    }

    const fix = lastFix[pipelineId];

    if (!fix || !fix.command) {
        return {
            status: "FAILED",
            message: "No fix available",
            logs
        };
    }

    const pipeline = await dal.getPipelineById(pipelineId);
    const repoDir = path.join(__dirname, "..", "repos", `pipeline_${pipelineId}`);

    try {
        log("[RETRY] Applying fix: " + fix.command);

        await executor.runCommand(fix.command, repoDir);

        log("[RETRY] Fix applied successfully");

        if (fix.stage === "BUILD") {
            await executor.runCommand(pipeline.test_command, repoDir);
            log("[TEST] Success");
        }

        return {
            status: "SUCCESS",
            stage: "DEPLOY",
            logs
        };

    } catch (err) {
        log("[RETRY] Failed again");

        return {
            status: "FAILED",
            stage: fix.stage,
            logs
        };
    }
}

// ---------------- GET ALL PIPELINES ----------------
async function getAllPipelines() {
    return await dal.getPipelines();
}

module.exports = {
    createPipeline,
    processPipeline,
    retryPipeline,
    getAllPipelines
};