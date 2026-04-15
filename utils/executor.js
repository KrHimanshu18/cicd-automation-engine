const { exec } = require("child_process");

function runCommand(command, cwd = null) {
    return new Promise((resolve, reject) => {

        exec(command, {
            cwd,
            timeout: 60000
        }, (error, stdout, stderr) => {

            const output = (stdout || "") + "\n" + (stderr || "");

            // 🔥 If error occurs
            if (error) {

                const msg = output.toLowerCase();

                // Treat warnings as success
                if (
                    msg.includes("warn") &&
                    !msg.includes("err!")
                ) {
                    return resolve(output);
                }

                // ❗ IMPORTANT: reject on failure
                return reject(new Error(output));
            }

            // Success
            resolve(output);
        });
    });
}

module.exports = { runCommand };