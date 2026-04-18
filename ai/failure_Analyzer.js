// ---------------- SIMILARITY FUNCTION ----------------
function similarity(a, b) {
    let longer = a.length > b.length ? a : b;
    let shorter = a.length > b.length ? b : a;

    let longerLength = longer.length;
    if (longerLength === 0) return 1.0;

    let same = 0;
    for (let i = 0; i < shorter.length; i++) {
        if (longer[i] === shorter[i]) same++;
    }

    return same / longerLength;
}

// ---------------- ML-LIKE ANALYZER ----------------
function mlAnalyze(log) {
    const msg = log.toLowerCase();

    // Dependency issues
    if (msg.includes("cannot find module") || msg.includes("module not found")) {
        return {
            type: "Dependency Error",
            suggestion: "Missing dependency. Run npm install",
            fixCommand: "npm install"
        };
    }

    // Database issues
    if (
        msg.includes("sql") ||
        msg.includes("database") ||
        msg.includes("connection refused") ||
        msg.includes("er_access_denied_error")
    ) {
        return {
            type: "Database Error",
            suggestion: "Check DB connection, credentials, or DB server status",
            fixCommand: null
        };
    }

    return null;
}

// ---------------- MAIN ANALYZER ----------------
function analyzeFailure(log) {
    console.log("[DEBUG] Incoming error:", log);
    const msg = log.toLowerCase();

    // ---------------- SYNTAX ERRORS ----------------
    if (
        msg.includes("syntaxerror") ||
        msg.includes("unexpected token") ||
        msg.includes("missing ;") ||
        msg.includes("parse error")
    ) {
        return {
            type: "Syntax Error",
            suggestion: "Check code syntax (missing brackets, semicolons, etc.)",
            fixCommand: null
        };
    }

    // ---------------- LOGIC ERRORS ----------------
    if (
        msg.includes("assertion failed") ||
        msg.includes("expected") ||
        msg.includes("undefined is not a function")
    ) {
        return {
            type: "Logic Error",
            suggestion: "Fix business logic or test expectations",
            fixCommand: null
        };
    }

    // ---------------- TEST TYPO ----------------
    if (msg.includes("testtt") || msg.includes("tset")) {
        return {
            type: "Test Error",
            suggestion: "Correct test command to npm test",
            fixCommand: "npm test"
        };
    }

    // ---------------- INSTALL TYPO ----------------
    if (msg.includes("installl") || msg.includes("installll")) {
        return {
            type: "Build Error",
            suggestion: "Correct build command to npm install",
            fixCommand: "npm install"
        };
    }

    // ---------------- COMMAND NOT FOUND ----------------
    if (msg.includes("not recognized") || msg.includes("command not found")) {
        if (msg.includes("test")) {
            return {
                type: "Test Error",
                suggestion: "Use npm test",
                fixCommand: "npm test"
            };
        }

        if (msg.includes("install")) {
            return {
                type: "Build Error",
                suggestion: "Use npm install",
                fixCommand: "npm install"
            };
        }
    }

    // ---------------- FUZZY MATCH ----------------
    const validCommands = ["npm install", "npm test", "npm run build"];

    let detectedCommand = "";

    if (msg.includes("npm")) {
        const words = msg.split(" ");
        const npmIndex = words.findIndex(w => w.includes("npm"));

        if (npmIndex !== -1) {
            detectedCommand = words.slice(npmIndex, npmIndex + 2).join(" ");
        }
    }

    let bestMatch = null;
    let bestScore = 0;

    for (let cmd of validCommands) {
        const score = similarity(detectedCommand, cmd);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = cmd;
        }
    }

    if (bestScore > 0.6 && bestMatch) {
        return {
            type: "Typo Error",
            suggestion: `Did you mean "${bestMatch}"?`,
            fixCommand: bestMatch
        };
    }

    // ---------------- ML LAYER ----------------
    const mlResult = mlAnalyze(log);
    if (mlResult) return mlResult;

    // ---------------- DEFAULT ----------------
    return {
        type: "Unknown",
        suggestion: "Check logs manually",
        fixCommand: null
    };
}

module.exports = {
    analyzeFailure
};