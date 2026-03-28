// Pipeline Logic
function processPipeline(buildStatus, testStatus) {
    if (buildStatus === "Success" && testStatus === "Success") {
        return "Deploy";
    }
    return "Stop";
}

// Failure Classification
function classifyFailure(logMessage) {
    if (logMessage.includes("test")) return "Test Failure";
    if (logMessage.includes("deploy")) return "Deployment Failure";
    if (logMessage.includes("runtime")) return "Runtime Failure";
    return "Unknown Failure";
}

// Recovery Logic
function getRecoveryAction(failureType) {
    if (failureType === "Test Failure") return "Retry Build";
    if (failureType === "Deployment Failure") return "Rollback Deployment";
    return "Restart Service";
}

// Notification Logic
function generateNotification(message) {
    return "NOTIFICATION: " + message;
}