const express = require("express");
const path = require("path");
const bll = require("./bll"); // or correct path

const app = express();
app.use(express.json());

app.get('/favicon.ico', (req, res) => res.sendStatus(204));
// Serve UI
app.use(express.static(path.join(__dirname)));

// API routes
app.post("/pipeline", async (req, res) => {
    const id = await bll.createPipeline(req.body.name);
    res.json({ id });
});

app.post("/run/:id", async (req, res) => {
    const result = await bll.processPipeline(
        req.params.id,
        req.body.buildStatus,
        req.body.testStatus
    );
    res.json({ result });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});