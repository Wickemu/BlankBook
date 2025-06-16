const request = require('supertest');
jest.mock('express-async-errors', () => ({}), { virtual: true });
const { app } = require('../server');
const mongoose = require('mongoose');

describe('GET /api/health', () => {
  it('should respond with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ status: 'ok' }));
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

