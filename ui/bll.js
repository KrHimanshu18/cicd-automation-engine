const DAL = require("../dal/database");

const dal = new DAL();

// CREATE PIPELINE
async function createPipeline(name) {
    const pipelineId = await dal.insertPipeline(name, "CREATED");
    return pipelineId;
}

// GET ALL PIPELINES
async function getAllPipelines() {
    return await dal.getPipelines();
}

// PIPELINE EXECUTION LOGIC
async function processPipeline(pipelineId, buildStatus, testStatus) {
    let result;

    // Update status to RUNNING
    await dal.updatePipelineStatus(pipelineId, "RUNNING");

    if (buildStatus === "Success" && testStatus === "Success") {
        result = "Deploy";
        await dal.updatePipelineStatus(pipelineId, "SUCCESS");
    } else {
        result = "Stop";
        await dal.updatePipelineStatus(pipelineId, "FAILED");
    }

    return result;
}

// FAILURE CLASSIFICATION
function classifyFailure(logMessage) {
    if (logMessage.includes("test")) return "Test Failure";
    if (logMessage.includes("deploy")) return "Deployment Failure";
    if (logMessage.includes("runtime")) return "Runtime Failure";
    return "Unknown Failure";
}

// RECOVERY LOGIC (WITH DB UPDATE)
async function getRecoveryAction(pipelineId, failureType) {
    let action;

    if (failureType === "Test Failure") action = "Retry Build";
    else if (failureType === "Deployment Failure") action = "Rollback Deployment";
    else action = "Restart Service";

    // Mark recovery triggered
    await dal.updatePipelineStatus(pipelineId, "RECOVERY_TRIGGERED");

    return action;
}

// NOTIFICATION
function generateNotification(message) {
    return "NOTIFICATION: " + message;
}

module.exports = {
    createPipeline,
    getAllPipelines,
    processPipeline,
    classifyFailure,
    getRecoveryAction,
    generateNotification
};