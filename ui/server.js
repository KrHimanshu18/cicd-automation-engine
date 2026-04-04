const express = require("express");
const bll = require("./bll/bll");

const app = express();
app.use(express.json());

// Create pipeline
app.post("/pipeline", async (req, res) => {
    const id = await bll.createPipeline(req.body.name);
    res.json({ id });
});

// Run pipeline
app.post("/run/:id", async (req, res) => {
    const result = await bll.processPipeline(
        req.params.id,
        req.body.buildStatus,
        req.body.testStatus
    );
    res.json({ result });
});

// Get pipelines
app.get("/pipelines", async (req, res) => {
    const data = await bll.getAllPipelines();
    res.json(data);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});