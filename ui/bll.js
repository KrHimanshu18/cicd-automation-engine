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

    return id;
}

// ---------------- PROCESS PIPELINE ----------------

async function processPipeline(pipelineId) {
    try {
        const pipeline = await dal.getPipelineById(pipelineId);

        if (!pipeline) {
            return { status: "FAILED", stage: "CLONE" };
        }

    const { repo_url, build_command, test_command } = pipeline;

    const repoDir = path.join(__dirname, "..", "repos", `pipeline_${pipelineId}`);

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
            await executor.runCommand(build_command, repoDir);
        } catch (err) {
            analyzeFailure(err);
            return { status: "FAILED", stage: "BUILD" };
        }

        // -------- TEST --------
        try {
            await executor.runCommand(test_command, repoDir);
        } catch (err) {
            analyzeFailure(err);
            return { status: "FAILED", stage: "TEST" };
        }

        // -------- DEPLOY --------
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