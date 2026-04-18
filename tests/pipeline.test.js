const request = require('supertest');
const app = require('../ui/server');
const { initDB, getPool } = require('../dal/db_config');

jest.mock('../utils/executor', () => ({
  runCommand: jest.fn()
}));

const { runCommand } = require('../utils/executor');

describe('Pipeline API Tests', () => {

  let pipelineId;

  beforeAll(async () => {
    await initDB();

    const res = await request(app)
      .post('/pipeline')
      .send({
        name: "CI Test Pipeline",
        repoUrl: "https://github.com/test/repo",
        buildCommand: "npm install",
        testCommand: "npm test"
      });

    pipelineId = res.body.id;
  });

  beforeEach(() => {
    runCommand.mockReset();
  });

  test('Run pipeline SUCCESS', async () => {
    runCommand
      .mockResolvedValueOnce("clone success")
      .mockResolvedValueOnce("build success")
      .mockResolvedValueOnce("test success");

    const res = await request(app).post(`/run/${pipelineId}`);

    expect(res.body.status).toBe("SUCCESS");
  });

  test('Run pipeline BUILD FAILURE', async () => {
    runCommand
      .mockResolvedValueOnce("clone success")
      .mockRejectedValueOnce("build failed");

    const res = await request(app).post(`/run/${pipelineId}`);

    expect(res.body.stage).toBe("BUILD");
  });

  test('Run pipeline TEST FAILURE', async () => {
    runCommand
      .mockResolvedValueOnce("clone success")
      .mockResolvedValueOnce("build success")
      .mockRejectedValueOnce("test failed");

    const res = await request(app).post(`/run/${pipelineId}`);

    expect(res.body.stage).toBe("TEST");
  });

  test('Retry BUILD success', async () => {

    runCommand
      .mockResolvedValueOnce("clone success")
      .mockRejectedValueOnce("installl failed");

    const firstRun = await request(app).post(`/run/${pipelineId}`);

    expect(firstRun.body.status).toBe("FAILED");
    expect(firstRun.body.fixCommand).toBe("npm install");

    runCommand
      .mockResolvedValueOnce("retry success")
      .mockResolvedValueOnce("test success");

    const retry = await request(app).post(`/retry/${pipelineId}`);

    expect(retry.body.status).toBe("SUCCESS");
  });

});

afterAll(async () => {
  const pool = getPool();
  await pool.end();
});