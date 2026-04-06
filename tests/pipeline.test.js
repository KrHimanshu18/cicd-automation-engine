const request = require('supertest');
const app = require('../ui/server');
const { initDB } = require('../dal/db_config');

// MOCK EXECUTOR (CRITICAL)
jest.mock('../utils/executor', () => ({
  runCommand: jest.fn()
}));

const { runCommand } = require('../utils/executor');

describe('Pipeline API Tests', () => {

  let pipelineId;

  // ---------------- INIT DB ----------------
  beforeAll(async () => {
    await initDB();
  });

  beforeEach(() => {
    runCommand.mockReset();
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

    runCommand
      .mockResolvedValueOnce("clone success")
      .mockResolvedValueOnce("build success")
      .mockResolvedValueOnce("test success");

    const res = await request(app)
      .post(`/run/${pipelineId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.stage).toBe("DEPLOY");
  });

  // ---------------- BUILD FAILURE ----------------
  test('Run pipeline BUILD FAILURE', async () => {

    runCommand
      .mockResolvedValueOnce("clone success")
      .mockRejectedValueOnce("build failed");

    const res = await request(app)
      .post(`/run/${pipelineId}`);

    expect(res.body.status).toBe("FAILED");
    expect(res.body.stage).toBe("BUILD");
  });

  // ---------------- TEST FAILURE ----------------
  test('Run pipeline TEST FAILURE', async () => {

    runCommand
      .mockResolvedValueOnce("clone success")
      .mockResolvedValueOnce("build success")
      .mockRejectedValueOnce("test failed");

    const res = await request(app)
      .post(`/run/${pipelineId}`);

    expect(res.body.status).toBe("FAILED");
    expect(res.body.stage).toBe("TEST");
  });

  // ---------------- CLONE FAILURE ----------------
  test('Run pipeline CLONE FAILURE', async () => {

    runCommand
      .mockRejectedValueOnce("clone failed");

    const res = await request(app)
      .post(`/run/${pipelineId}`);

    expect(res.body.status).toBe("FAILED");
    expect(res.body.stage).toBe("CLONE");
  });

  // ---------------- GET PIPELINES ----------------
  test('Get all pipelines', async () => {
    const res = await request(app).get('/pipelines');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

// FIX OPEN HANDLE ISSUE
afterAll(() => {
  process.exit(0);
});