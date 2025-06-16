const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
jest.mock('express-async-errors', () => ({}), { virtual: true });
const { app, connectToDatabase } = require('../server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await connectToDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('POST /api/savestory', () => {
  it('saves a story and retrieves it', async () => {
    const story = {
      storyTitle: 'Test Story',
      storyAuthor: 'Tester',
      storyText: 'Once upon a time'
    };
    const res = await request(app).post('/api/savestory').send(story);
    expect(res.statusCode).toBe(200);

    const list = await request(app).get('/api/getstories');
    expect(list.statusCode).toBe(200);
    expect(list.body.length).toBe(1);
    expect(list.body[0].storyTitle).toBe('Test Story');
  });
});
