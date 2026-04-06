const { exec } = require("child_process");

function runCommand(command, cwd = null) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                return reject(stderr || error.message);
            }
            resolve(stdout);
        });
    });
}

module.exports = { runCommand };