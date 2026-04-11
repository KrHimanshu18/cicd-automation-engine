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

    // Missing script
    if (msg.includes("missing script")) {
        return {
            type: "Script Error",
            suggestion: "Check package.json scripts",
            fixCommand: null
        };
    }

    // Module not found
    if (msg.includes("cannot find module") || msg.includes("module not found")) {
        return {
            type: "Dependency Error",
            suggestion: "Run npm install",
            fixCommand: "npm install"
        };
    }

    return null;
}

// ---------------- MAIN ANALYZER ----------------
function analyzeFailure(log) {
    const msg = log.toLowerCase();

    // ---------------- RULE-BASED ----------------

    // Test typo
    if (msg.includes("testtt") || msg.includes("tset")) {
        return {
            type: "Test Error",
            suggestion: "Correct test command to npm test",
            fixCommand: "npm test"
        };
    }

    // Install typo
    if (msg.includes("installl") || msg.includes("installll")) {
        return {
            type: "Build Error",
            suggestion: "Correct build command to npm install",
            fixCommand: "npm install"
        };
    }

    // Command not found
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

    // ---------------- FUZZY MATCHING ----------------

    const validCommands = [
        "npm install",
        "npm test",
        "npm run build"
    ];

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

    // ---------------- ML-LIKE LAYER ----------------

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