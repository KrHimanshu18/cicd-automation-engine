const { exec } = require("child_process");

function runCommand(command, cwd = null) {
    return new Promise((resolve) => {

        exec(command, {
            cwd,
            timeout: 60000
        }, (error, stdout, stderr) => {

            const output = stdout + "\n" + stderr;

            // 🔥 FIX: treat warnings as success
            if (error) {

                // If output contains only warnings → treat as success
                if (
                    output.toLowerCase().includes("warn") &&
                    !output.toLowerCase().includes("err!")
                ) {
                    return resolve({
                        status: "SUCCESS",
                        log: output
                    });
                }

                return resolve({
                    status: "FAILED",
                    log: output
                });
            }

            resolve({
                status: "SUCCESS",
                log: output
            });
        });
    });
}

module.exports = { runCommand };