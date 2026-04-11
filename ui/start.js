const app = require("./server"); // same folder (ui)
const { initDB } = require("../dal/db_config"); // go OUT of ui → into dal

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initDB(); // initialize DB first

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Failed to start server:", err.message);
    }
}

startServer();