const request = require('supertest');
const app = require('../ui/server');
const { initDB } = require('../dal/db_config');

describe('Pipeline API Tests', () => {

  let pipelineId;

  // Initialize DB
  beforeAll(async () => {
    await initDB();
  });

  // ---------------- CREATE PIPELINE ----------------
  test('Create pipeline with config', async () => {
    const res = await request(app)
      .post('/pipeline')
      .send({
        name: "CI Test Pipeline",
        repoUrl: "https://github.com/test/repo",
        buildCommand: "npm install",
        testCommand: "npm test"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();

    pipelineId = res.body.id;
  });

  // ---------------- SUCCESS CASE ----------------
  test('Run pipeline SUCCESS', async () => {
    const res = await request(app)
      .post(`/run/${pipelineId}`)
      .send({
        buildStatus: "Success",
        testStatus: "Success"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
  });

  // ---------------- BUILD FAILURE ----------------
  test('Run pipeline BUILD FAILURE', async () => {
    const res = await request(app)
      .post(`/run/${pipelineId}`)
      .send({
        buildStatus: "Fail",
        testStatus: "Success"
      });

    expect(res.body.status).toBe("FAILED");
    expect(res.body.stage).toBe("BUILD");
  });

  // ---------------- TEST FAILURE ----------------
  test('Run pipeline TEST FAILURE', async () => {
    const res = await request(app)
      .post(`/run/${pipelineId}`)
      .send({
        buildStatus: "Success",
        testStatus: "Fail"
      });

    expect(res.body.status).toBe("FAILED");
    expect(res.body.stage).toBe("TEST");
  });

  // ---------------- GET PIPELINES ----------------
  test('Get all pipelines', async () => {
    const res = await request(app).get('/pipelines');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});