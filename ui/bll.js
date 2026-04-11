const path = require("path");
const fs = require("fs");
const DAL = require("../dal/database");
const { analyzeFailure } = require("../ai/failure_Analyzer");
const { runCommand } = require("../utils/executor"); // ✅ IMPORTANT

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
            await runCommand(`git clone ${repo_url} ${repoDir}`);
        } catch (err) {
            return { status: "FAILED", stage: "CLONE" };
        }

        // -------- BUILD --------
        try {
            await runCommand(build_command, repoDir);
        } catch (err) {
            analyzeFailure(err);
            return { status: "FAILED", stage: "BUILD" };
        }

        // -------- TEST --------
        try {
            await runCommand(test_command, repoDir);
        } catch (err) {
            analyzeFailure(err);
            return { status: "FAILED", stage: "TEST" };
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