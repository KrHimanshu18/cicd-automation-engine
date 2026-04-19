const express = require("express");
const cors = require("cors");
const path = require("path");

const bll = require("./bll");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// Serve UI (since server.js is inside ui folder)
app.use(express.static(__dirname));

// ---------------- ROUTES ----------------

// Create pipeline
app.post("/pipeline", async (req, res) => {
    try {
        const pipelineId = await bll.createPipeline(req.body);

        console.log("Pipeline created with ID:", pipelineId); // debug

        res.json({
            message: "Pipeline created",
            id: pipelineId
        });

    } catch (err) {
        console.error("Error creating pipeline:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Run pipeline
app.post("/run/:id", async (req, res) => {
    try {
        const pipelineId = req.params.id;

        const result = await bll.processPipeline(pipelineId);

        res.json(result);

    } catch (err) {
        console.error("Error running pipeline:", err.message);
        res.status(500).json({
            status: "FAILED",   
            stage: "UNKNOWN",
            error: err.message
        });
    }
});

// Get all pipelines
app.get("/pipelines", async (req, res) => {
    try {
        const pipelines = await bll.getAllPipelines();
        res.json(pipelines);
    } catch (err) {
        console.error("Error fetching pipelines:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Retry pipeline
app.post("/retry/:id", async (req, res) => {
    try {
        const pipelineId = req.params.id;

        console.log("Retrying pipeline with fix:", pipelineId);

        const result = await bll.retryPipeline(pipelineId);

        res.json(result);

    } catch (err) {
        console.error("Retry error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ---------------- EXPORT APP ----------------
module.exports = app;