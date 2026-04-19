
// // ---------------- SIMILARITY FUNCTION ----------------
// function similarity(a, b) {
//     if (!a || !b) return 0;

//     a = a.toLowerCase();
//     b = b.toLowerCase();

//     let matches = 0;
//     const len = Math.min(a.length, b.length);

//     for (let i = 0; i < len; i++) {
//         if (a[i] === b[i]) matches++;
//     }

//     return matches / Math.max(a.length, b.length);
// }

// // ---------------- EXTRACT COMMAND ----------------
// function extractCommand(msg) {
//     const npmMatch = msg.match(/npm\s+\w+/);
//     return npmMatch ? npmMatch[0] : "";
// }

// // ---------------- ML-LIKE ANALYZER ----------------
// function mlAnalyze(msg) {

//     // Missing script
//     if (msg.includes("missing script")) {
//         return {
//             type: "Script Error",
//             suggestion: "Check package.json scripts",
//             fixCommand: null
//         };
//     }

//     // Module not found
//     if (msg.includes("cannot find module") || msg.includes("module not found")) {
//         return {
//             type: "Dependency Error",
//             suggestion: "Run npm install",
//             fixCommand: "npm install"
//         };
//     }

//     // Permission / install issues
//     if (msg.includes("permission denied")) {
//         return {
//             type: "Permission Error",
//             suggestion: "Retry installation",
//             fixCommand: "npm install"
//         };
//     }

//     return null;
// }

// // ---------------- MAIN ANALYZER ----------------
// function analyzeFailure(log) {

//     const msg = log.toLowerCase();

//     // ---------------- RULE-BASED (STRONG SIGNALS) ----------------

//     // Test typo
//     if (msg.includes("testtt") || msg.includes("tset")) {
//         return {
//             type: "Test Error",
//             suggestion: "Correct test command to npm test",
//             fixCommand: "npm test"
//         };
//     }

//     // Install typo
//     if (msg.includes("installl") || msg.includes("installll")) {
//         return {
//             type: "Build Error",
//             suggestion: "Correct build command to npm install",
//             fixCommand: "npm install"
//         };
//     }

//     // Command not found
//     if (msg.includes("not recognized") || msg.includes("command not found")) {

//         if (msg.includes("test")) {
//             return {
//                 type: "Test Error",
//                 suggestion: "Use npm test",
//                 fixCommand: "npm test"
//             };
//         }

//         if (msg.includes("install")) {
//             return {
//                 type: "Build Error",
//                 suggestion: "Use npm install",
//                 fixCommand: "npm install"
//             };
//         }
//     }

//     // ---------------- ML-LIKE LAYER (RUN EARLY) ----------------
//     const mlResult = mlAnalyze(msg);
//     if (mlResult) return mlResult;

//     // ---------------- FUZZY MATCHING ----------------

//     const validCommands = [
//         "npm install",
//         "npm test",
//         "npm run build"
//     ];

//     const detectedCommand = extractCommand(msg);

//     let bestMatch = null;
//     let bestScore = 0;

//     for (let cmd of validCommands) {
//         const score = similarity(detectedCommand, cmd);

//         if (score > bestScore) {
//             bestScore = score;
//             bestMatch = cmd;
//         }
//     }

//     // 🔥 Slightly lower threshold for better recovery
//     if (bestScore >= 0.5 && bestMatch) {
//         return {
//             type: "Typo Error",
//             suggestion: `Did you mean "${bestMatch}"?`,
//             fixCommand: bestMatch
//         };
//     }

//     // ---------------- DEFAULT ----------------

//     return {
//         type: "Unknown",
//         suggestion: "Check logs manually",
//         fixCommand: null
//     };
// }

// module.exports = {
//     analyzeFailure
// };

// ---------------- SIMILARITY FUNCTION ----------------
function similarity(a, b) {
    if (!a || !b) return 0;

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

// ---------------- EXTRACT FAILED COMMAND ----------------
function extractCommand(log) {
    const lines = log.split("\n");

    for (let line of lines) {
        const lower = line.toLowerCase();

        if (
            lower.includes("not recognized") ||
            lower.includes("command not found") ||
            lower.includes("unknown command")
        ) {
            // extract word + clean it
            let word = line.trim().split(" ")[0];

            //  remove quotes + junk
            word = word.replace(/[^a-zA-Z0-9]/g, "");

            return word.toLowerCase();
        }
    }

    return "";
}

// ---------------- ML-LIKE ANALYZER ----------------
function mlAnalyze(log) {
    const msg = log.toLowerCase();

    if (msg.includes("cannot find module") || msg.includes("module not found")) {
        return {
            type: "Dependency Error",
            error: log,
            suggestion: "Run npm install",
            fixCommand: "npm install"
        };
    }

    if (msg.includes("missing script")) {
        return {
            type: "Script Error",
            error: log,
            suggestion: "Check package.json scripts",
            fixCommand: null
        };
    }

    return null;
}

// ---------------- MAIN ANALYZER ----------------
function analyzeFailure(log) {
    console.log("[DEBUG] Incoming error:", log);
    const msg = log.toLowerCase();

    // ---------------- RULE-BASED ----------------

    if (msg.includes("not recognized") || msg.includes("command not found") || msg.includes("unknown command")) {

        // 🔥 General typo correction
        const failedCmd = extractCommand(log);

        const validCommands = [
            "npm install",
            "npm test",
            "npm run build"
        ];

        let bestMatch = null;
        let bestScore = 0;

        for (let cmd of validCommands) {
            const score = similarity(failedCmd, cmd);

            if (score > bestScore) {
                bestScore = score;
                bestMatch = cmd;
            }
        }

        if (bestScore > 0.4 && bestMatch) {
            return {
                type: "Typo Error",
                error: log,
                suggestion: `Did you mean "${bestMatch}"?`,
                fixCommand: bestMatch
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
            error: log,
            suggestion: `Did you mean "${bestMatch}"?`,
            fixCommand: bestMatch
        };
    }

    // ---------------- ML-LIKE ----------------

    const mlResult = mlAnalyze(log);
    if (mlResult) return mlResult;

    // ---------------- DEFAULT ----------------
    return {
        type: "Unknown Error",
        error: log,
        suggestion: "Check logs manually",
        fixCommand: null
    };
}

module.exports = {
    analyzeFailure
};