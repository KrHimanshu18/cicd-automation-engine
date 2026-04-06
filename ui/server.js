const express = require("express");
const path = require("path");
const bll = require("./bll");

const app = express();

// ---------------- MIDDLEWARE ---------------- //
app.use(express.json());

// Avoid favicon error
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Serve static UI
app.use(express.static(path.join(__dirname)));

// ---------------- API ROUTES ---------------- //

// CREATE PIPELINE
app.post("/pipeline", async (req, res) => {
    try {
        const { name, repoUrl, buildCommand, testCommand } = req.body;

        if (!name || !repoUrl) {
            return res.status(400).json({
                error: "name and repoUrl are required"
            });
        }

        const id = await bll.createPipeline({
            name,
            repoUrl,
            buildCommand,
            testCommand
        });

        res.status(200).json({ id });

    } catch (err) {
        console.error("Error in /pipeline:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// RUN PIPELINE (REAL EXECUTION)
app.post("/run/:id", async (req, res) => {
    try {
        const result = await bll.processPipeline(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error in /run:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET PIPELINES
app.get("/pipelines", async (req, res) => {
    try {
        const data = await bll.getAllPipelines();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error in /pipelines:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;