const request = require('supertest');
const createTestServer = require('../testServer');
const bcrypt = require('bcrypt');
const express = require('express');

let app, client, db;

beforeAll(async () => {
  const server = await createTestServer();
  app = server.app;
  client = server.client;
  db = server.db;
});

afterEach(async () => {
  // Cleanup streak test users after streak tests
  await db.collection('Users').deleteMany({
    user: { $in: ['streakUser1', 'streakUser2'] }
  });
});

describe('POST /api/login', () => {
  const validUser = {
    user: 'babahaj',
    password: 'The25thbam!'
  };

  const wrongPassword = {
    ...validUser,
    password: 'WrongPassword'
  };

  const nonexistentUser = {
    user: 'nonexistent',
    password: 'somepassword'
  };
 
  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send(validUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
    expect(res.body.error).toBe('');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send(wrongPassword);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.toLowerCase()).toMatch(/password/i);
  });

  it('should fail login with nonexistent user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send(nonexistentUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.toLowerCase()).toMatch(/invalid username|password/i);
  });

  it('should fail when user field is missing', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ password: validUser.password });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.toLowerCase()).toMatch(/user|missing/i);
  });

  it('should fail when password field is missing', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ user: validUser.user });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.toLowerCase()).toMatch(/password|missing/i);
  });

  it('should fail when fields are empty strings', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ user: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error.toLowerCase()).toMatch(/missing|empty|invalid|required|username/i);
  });

  it('should fail when extra fields are included', async () => {
    const userWithExtra = {
      ...validUser,
      extra: 'hacker'
    };

    const res = await request(app)
      .post('/api/login')
      .send(userWithExtra);

    expect(res.statusCode).toBe(400); // or 200 if your API allows it
    expect(res.body.error.toLowerCase()).toMatch(/unexpected|extra|invalid/i); // Update based on your API response
  });


  it('should reject GET requests (invalid method)', async () => {
    const res = await request(app)
      .get('/api/login');

    expect(res.statusCode).toBe(404); // Or 405 depending on how your server is set up
  });

  it('should increment streak if last login was between 1 and 2 days ago', async () => {
    const now = Date.now();
    const previousLogin = now - 36 * 60 * 60 * 1000; // 36 hours ago

    const hashedPassword = await bcrypt.hash('streakpass1', 10);
    await db.collection('Users').insertOne({
      id: 201,
      user: 'streakUser1',
      password: hashedPassword,
      email: 'streak1@example.com',
      name: 'Streak One',
      isVerified: true,
      lastlogin: previousLogin,
      streak: 3
    });

    const res = await request(app)
      .post('/api/login')
      .send({ user: 'streakUser1', password: 'streakpass1' });

    expect(res.status).toBe(200);
    expect(res.body.error).toBe('');

    const updated = await db.collection('Users').findOne({ id: 201 });
    expect(updated.streak).toBe(4);
  });

  it('should reset streak if last login was more than 2 days ago', async () => {
    const now = Date.now();
    const previousLogin = now - 3 * 24 * 60 * 60 * 1000; // 3 days ago

    const hashedPassword = await bcrypt.hash('streakpass2', 10);
    await db.collection('Users').insertOne({
      id: 202,
      user: 'streakUser2',
      password: hashedPassword,
      email: 'streak2@example.com',
      name: 'Streak Two',
      isVerified: true,
      lastlogin: previousLogin,
      streak: 5
    });

    const res = await request(app)
      .post('/api/login')
      .send({ user: 'streakUser2', password: 'streakpass2' });

    expect(res.status).toBe(200);
    expect(res.body.error).toBe('');

    const updated = await db.collection('Users').findOne({ id: 202 });
    expect(updated.streak).toBe(0);
  });

  it('should return 500 if database throws an error', async () => {
    const mockDb = {
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Mock DB error'))
      })
    })
  };

    const errorApp = express();
    errorApp.use(express.json());
    errorApp.use('/api/login', require('../APIs/login')(mockDb));

    const res = await request(errorApp)
      .post('/api/login')
      .send({ user: 'errorUser', password: 'any' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Server error');
  });
});

afterAll(async () => {
  if (client) {
    await client.close(); // Prevent lingering open handles
  }
});