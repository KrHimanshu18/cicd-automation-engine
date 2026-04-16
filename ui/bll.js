const path = require("path");
const fs = require("fs");
const DAL = require("../dal/database");
const { analyzeFailure } = require("../ai/failure_Analyzer");
const executor = require("../utils/executor");

const dal = new DAL();

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

async function getAllPipelines() {
    return await dal.getPipelines();
}

async function processPipeline(pipelineId) {
    let logs = [];

    function log(msg) {
        console.log(msg);
        logs.push(msg);
    }

    try {
        const pipeline = await dal.getPipelineById(pipelineId);

        if (!pipeline) {
            return { status: "FAILED", stage: "CLONE", logs };
        }

        const { repo_url, build_command, test_command } = pipeline;

        const baseDir = path.join(__dirname, "..", "repos");
        if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

        const repoDir = path.join(baseDir, `pipeline_${pipelineId}`);

        if (fs.existsSync(repoDir)) {
            fs.rmSync(repoDir, { recursive: true, force: true });
        }

        // -------- CLONE --------
        try {
            log("[CLONE] Running git clone");
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
            log("[AI] Suggestion: " + analysis.suggestion);
            log("[AI] Fix: " + analysis.fixCommand);

            // Retry if fix exists (even if same command)
            if (analysis.fixCommand) {
                try {
                    log("[RETRY] Running: " + analysis.fixCommand);
                    await executor.runCommand(analysis.fixCommand, repoDir);
                    log("[BUILD] Retry Success");
                } catch {
                    return { status: "FAILED", stage: "BUILD", logs };
                }
            } else {
                return { status: "FAILED", stage: "BUILD", logs };
            }
        }

        // -------- TEST --------
        try {
            log("[TEST] Running: " + test_command);
            await executor.runCommand(test_command, repoDir);
            log("[TEST] Success");
        } catch (err) {
            log("[TEST] Failed");

            const analysis = analyzeFailure(err.toString());
            log("[AI] Suggestion: " + analysis.suggestion);
            log("[AI] Fix: " + analysis.fixCommand);

            if (analysis.fixCommand) {
                try {
                    log("[RETRY] Running: " + analysis.fixCommand);
                    await executor.runCommand(analysis.fixCommand, repoDir);
                    log("[TEST] Retry Success");
                } catch {
                    return { status: "FAILED", stage: "TEST", logs };
                }
            } else {
                return { status: "FAILED", stage: "TEST", logs };
            }
        }

        log("Pipeline completed");

        return {
            status: "SUCCESS",
            stage: "DEPLOY",
            logs
        };

    } catch (err) {
        throw err;
    }
}

module.exports = {
    createPipeline,
    processPipeline,
    getAllPipelines
};