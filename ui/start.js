const app = require('./server'); // or './ui/server' if in root
const { initDB } = require('../dal/db_config');

const PORT = process.env.PORT || 3000;

async function startServer() {
    await initDB(); // creates DB + tables automatically

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();