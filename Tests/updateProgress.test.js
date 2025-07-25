const request = require('supertest');
const createTestServer = require('../testServer');
const token = require('../createJWT.js');

jest.mock('../createJWT.js'); // Mock token module

let app, client, db;

beforeAll(async () => {
  const server = await createTestServer();
  app = server.app;
  client = server.client;
  db = server.db;
});

afterEach(async () => {
  await db.collection('Users').deleteMany({ user: /^testuser/ });
  jest.clearAllMocks();
});

afterAll(async () => {
  if (client) await client.close();
});

describe('POST /api/updateProgress', () => {
  const testUser = {
    user: 'testuser_progress',
    id: 123456,
    progressW: 1,
    progressY: 1,
    progressO: 1,
    rank: 0,
  };

  beforeEach(async () => {
    await db.collection('Users').insertOne(testUser);
  });

  it('should update progress and rank, refresh token, and return updated values', async () => {
    token.isExpired.mockReturnValue(false);
    token.refresh.mockReturnValue('newJwtToken');

    const res = await request(app)
      .post('/api/updateProgress')
      .send({
        id: testUser.id,
        progressW: 6,
        progressY: 4,
        progressO: 2,
        jwtToken: 'validToken',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBe('');
    expect(res.body.rank).toBe(2);
    expect(res.body.progressW).toBe(6);
    expect(res.body.progressY).toBe(4);
    expect(res.body.progressO).toBe(2);
    expect(res.body.jwtToken).toBe('newJwtToken');

    const updatedUser = await db.collection('Users').findOne({ id: testUser.id });
    expect(updatedUser.progressW).toBe(6);
    expect(updatedUser.progressY).toBe(4);
    expect(updatedUser.progressO).toBe(2);
    expect(updatedUser.rank).toBe(2);
  });

  it('should return error if token is expired', async () => {
    token.isExpired.mockReturnValue(true);

    const res = await request(app)
      .post('/api/updateProgress')
      .send({
        id: testUser.id,
        progressW: 6,
        progressY: 4,
        progressO: 2,
        jwtToken: 'expiredToken',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBe('The JWT is no longer valid');
    expect(res.body.jwtToken).toBe('');
  });

  it('should return 404 if user is not found', async () => {
    token.isExpired.mockReturnValue(false);
    token.refresh.mockReturnValue('refreshedToken');

    const res = await request(app).post('/api/updateProgress').send({
      id: 9999999,
      progressW: 5,
      progressY: 3,
      progressO: 1,
      jwtToken: 'validToken',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
    expect(res.body.jwtToken).toBe('');
  });

  it('should return 500 if token.refresh throws', async () => {
    token.isExpired.mockReturnValue(false);
    token.refresh.mockImplementation(() => {
      throw new Error('JWT refresh failed');
    });

    const res = await request(app).post('/api/updateProgress').send({
      id: testUser.id,
      progressW: 8,
      progressY: 8,
      progressO: 8,
      jwtToken: 'validToken',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('JWT refresh failed');
    expect(res.body.jwtToken).toBe('');
  });
});

describe('POST /api/getUserProgress', () => {
  const testUser = {
    user: 'testuser_getprogress',
    id: 654321,
    progressW: 3,
    progressY: 2,
    progressO: 1,
  };

  beforeEach(async () => {
    await db.collection('Users').insertOne(testUser);
  });

  it('should return user progress and refreshed token', async () => {
    token.isExpired.mockReturnValue(false);
    token.refresh.mockReturnValue('refreshedToken');

    const res = await request(app)
      .post('/api/getUserProgress')
      .send({
        id: testUser.id,
        jwtToken: 'validToken',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBe('');
    expect(res.body.progressW).toBe(testUser.progressW);
    expect(res.body.progressY).toBe(testUser.progressY);
    expect(res.body.progressO).toBe(testUser.progressO);
    expect(res.body.jwtToken).toBe('refreshedToken');
  });

  it('should return error if token expired', async () => {
    token.isExpired.mockReturnValue(true);

    const res = await request(app)
      .post('/api/getUserProgress')
      .send({
        id: testUser.id,
        jwtToken: 'expiredToken',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBe('The JWT is no longer valid');
    expect(res.body.jwtToken).toBe('');
  });

  it('should return 404 if user not found', async () => {
    token.isExpired.mockReturnValue(false);

    const res = await request(app)
      .post('/api/getUserProgress')
      .send({
        id: 999999, // nonexistent user
        jwtToken: 'validToken',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('User not found');
    expect(res.body.jwtToken).toBe('');
  });

  it('should return 500 if token.refresh throws error', async () => {
    token.isExpired.mockReturnValue(false);
    token.refresh.mockImplementation(() => {
      throw new Error('JWT refresh crash');
    });

    const res = await request(app)
      .post('/api/getUserProgress')
      .send({
        id: testUser.id,
        jwtToken: 'validToken',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('JWT refresh crash');
    expect(res.body.jwtToken).toBe('');
  });
});
