const DAL = require("../dal/database");
const { runCommand } = require("../utils/executor");
const { analyzeFailure } = require("../ai/failure_Analyzer");
const fs = require("fs");

const dal = new DAL();
const MAX_RETRIES = 1;

// ---------------- CREATE PIPELINE ----------------
async function createPipeline(data) {
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

    console.log("Created Pipeline ID:", pipelineId);
    return pipelineId;
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
            return {
                status: "FAILED",
                stage: "CLONE",
                suggestion: "Pipeline not found"
            };
        }
        

        const repo_url = pipeline.repo_url;
        const build_command = pipeline.build_command || "npm install";
        const test_command = pipeline.test_command || "npm test";

        await dal.updatePipelineStatus(pipelineId, "RUNNING");

        const folder = `repos/pipeline_${pipelineId}_${Date.now()}`;

        try {
            if (fs.existsSync(folder)) {
                console.log("Deleting existing folder:", folder);
                fs.rmSync(folder, { recursive: true, force: true });
            }
        } catch (e) {
            console.log("Cleanup error:", e.message);
        }

        if (fs.existsSync(folder)) {
            console.log("Cleaning workspace...");
            fs.rmSync(folder, { recursive: true, force: true });
        }

        await runCommand("npm cache clean --force");

        // ---------------- CLONE ----------------
        const cloneResult = await runCommand(`git clone ${repo_url} ${folder}`);

        if (cloneResult.status === "FAILED") {
            return handleFailure(pipelineId, "CLONE", cloneResult.log, folder);
        }

        if (!fs.existsSync(`${folder}/package.json`)) {
            return handleFailure(
                pipelineId,
                "CLONE",
                "package.json missing",
                folder
            );
        }

        // ---------------- BUILD ----------------
        try {
            const buildResult = await runCommand(build_command, folder);

            if (buildResult.status === "FAILED") {
                throw new Error(buildResult.log);
            }

            await dal.insertJob(pipelineId, "BUILD", "SUCCESS", buildResult.log);

        } catch (err) {
            const result = await handleFailure(
                pipelineId,
                "BUILD",
                err,
                folder,
                0,
                build_command
            );
            return result;
        }

        // ---------------- TEST ----------------
        try {
            const testResult = await runCommand(test_command, folder);

            if (testResult.status === "FAILED") {
                throw new Error(testResult.log);
            }

            await dal.insertJob(pipelineId, "TEST", "SUCCESS", testResult.log);

        } catch (err) {
            const result = await handleFailure(
                pipelineId,
                "TEST",
                err,
                folder,
                0,
                test_command
            );
            return result;
        }

        // ---------------- DEPLOY ----------------
        await dal.insertJob(
            pipelineId,
            "DEPLOY",
            "SUCCESS",
            "Deployment completed"
        );

        await dal.updatePipelineStatus(pipelineId, "SUCCESS");

        return {
            status: "SUCCESS",
            stage: "DEPLOY"
        };

    } catch (err) {
        console.error("Pipeline execution error:", err.message);
        throw err;
    }
}

// ---------------- FAILURE HANDLER ----------------
async function handleFailure(
    pipelineId,
    stage,
    err,
    folder,
    retryCount = 0,
    originalCommand = ""
) {
    const log = err.toString();

    await dal.insertJob(pipelineId, stage, "FAILED", log);
    console.log(`[ERROR] ${stage} failed`);
    await dal.updatePipelineStatus(pipelineId, "FAILED");

    const aiResult = analyzeFailure(log);
    console.log(`[AI] Suggested fix: ${aiResult.fixCommand || "No fix available"}`);

    if (retryCount >= MAX_RETRIES) {
        return {
            status: "FAILED",
            stage,
            suggestion: aiResult.suggestion
        };
    }

    if (!aiResult.fixCommand) {
        return {
            status: "FAILED",
            stage,
            suggestion: aiResult.suggestion
        };
    }

    if (!aiResult.fixCommand) {
        console.log("No fix command available");
        return {
            status: "FAILED",
            stage,
            suggestion: aiResult.suggestion,
            logs: [
                `[ERROR] ${stage} failed`,
                `[AI] Suggested fix: ${aiResult.fixCommand || "None"}`
            ]
        };
    }

    if (aiResult.fixCommand === originalCommand) {
        console.log("Skipping retry — same command");

        return {
            status: "FAILED",
            stage,
            suggestion: aiResult.suggestion,
            logs: [
                `[ERROR] ${stage} failed`,
                `[AI] Suggested fix: ${aiResult.fixCommand || "None"}`
            ]
        };
    }

    try {
        console.log(`[INFO] Applying fix: ${aiResult.fixCommand}`);
        console.log(`[INFO] Retrying ${stage}...`);

        const fixResult = await runCommand(aiResult.fixCommand, folder);
        
        console.log("Retrying stage:", stage);

        const retryResult = await runCommand(aiResult.fixCommand, folder);

        if (retryResult.status === "SUCCESS") {
            await dal.updatePipelineStatus(pipelineId, "RECOVERED");
            console.log(`[SUCCESS] ${stage} recovered after retry`);

            return {
                status: "RECOVERED",
                stage,
                message: "Auto-recovered using AI fix",
                fixApplied: aiResult.fixCommand,
                logs: [
                    `[ERROR] ${stage} failed`,
                    `[AI] Suggested fix: ${aiResult.fixCommand}`,
                    `[INFO] Retrying ${stage}...`,
                    `[SUCCESS] ${stage} recovered`
                ]
            };
        }

    } catch (err) {
        console.log("Retry failed:", err.message);
    }
    // retry only once more
    return handleFailure(
        pipelineId,
        stage,
        err,
        folder,
        retryCount + 1,
        originalCommand
    );
}

// ---------------- EXPORT ----------------
module.exports = {
    createPipeline,
    getAllPipelines,
    processPipeline
};