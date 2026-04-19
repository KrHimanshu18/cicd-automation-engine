const { exec } = require("child_process");

function runCommand(command, cwd = null) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd, timeout: 60000 }, (error, stdout, stderr) => {

            const output = (stdout || "") + "\n" + (stderr || "");

            if (error) {
                return reject(new Error(output));
            }

            resolve(output);
        });
    });
}

module.exports = { runCommand };