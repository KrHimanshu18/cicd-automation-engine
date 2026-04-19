const { exec } = require("child_process");

function runCommand(command, cwd = null) {
    return new Promise((resolve, reject) => {

        exec(command, { cwd }, (error, stdout, stderr) => {
        exec(command, { cwd, timeout: 60000 }, (error, stdout, stderr) => {

            const output = (stdout || "") + "\n" + (stderr || "");
            const msg = output.toLowerCase();

            console.log("\nCOMMAND:", command);
            console.log("OUTPUT:", output);

            // 🚨 STRICT FAIL FIRST (NO WARN CHECK BEFORE THIS)
            if (
                msg.includes("unknown command") ||
                msg.includes("did you mean") ||
                msg.includes("not recognized") ||
                msg.includes("command not found") ||
                msg.includes("npm err") ||
                msg.includes("err!") ||
                msg.includes("fatal") ||
                msg.includes("error:")
            ) {
                return reject(output);
            }

            // 🚨 also fail if exec error exists
            if (error) {
                return reject(output);

            if (error) {
                return reject(new Error(output));
            }

            // ✅ success
            return resolve(output);
            resolve(output);
        });
    });
}

module.exports = { runCommand };