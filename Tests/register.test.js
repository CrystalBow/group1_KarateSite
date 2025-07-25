const request = require('supertest');
const createTestServer = require('../testServer');
const bcrypt = require('bcrypt');
const mail = require('@sendgrid/mail');

jest.mock('@sendgrid/mail');

let app, client, db;

beforeAll(async () => {
  const server = await createTestServer();
  app = server.app;
  client = server.client;
  db = server.db;
});

afterEach(async () => {
  await db.collection('Users').deleteMany({
    user: { $in: ['testuser', 'duplicateUser', 'emailErrorUser', 'missingUser', 'missingPassword', 'missingName', 'missingEmail', 'missingRank', 'emptyUser', 'badEmail', 'negRank', 'rankString'] },
  });
  jest.clearAllMocks();
});

afterAll(async () => {
  if (client) {
    await client.close();
  }
});

describe('POST /api/register', () => {
  const validUser = {
    user: 'registertestuser2',
    password: 'password123!',
    name: 'Test User2',
    email: 'testuser2@example.com',
    rank: 0,
  };

  it('should register a new user successfully', async () => {
    mail.send.mockResolvedValueOnce(true);

    const res = await request(app).post('/api/register').send(validUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', '');

    const insertedUser = await db.collection('Users').findOne({ user: validUser.user });
    expect(insertedUser).toBeTruthy();
    expect(insertedUser.user).toBe(validUser.user);
    expect(insertedUser.email).toBe(validUser.email);

    const passwordMatches = await bcrypt.compare(validUser.password, insertedUser.password);
    expect(passwordMatches).toBe(true);

    expect(insertedUser.verificationToken).toBeDefined();
    expect(mail.send).toHaveBeenCalledTimes(1);
  });

  it('should reject registration with duplicate username', async () => {
    await db.collection('Users').insertOne({
      user: 'duplicateUser',
      password: 'hashedpass',
      email: 'dup@example.com',
      name: 'Dup User',
      id: Date.now(),
      rank: 0,
      streak: 0,
      lastlogin: -1,
      isVerified: false,
      progressW: 0,
      progressY: 0,
      progressO: 0,
      verificationToken: 'token',
    });

    const res = await request(app)
      .post('/api/register')
      .send({
        user: 'duplicateUser',
        password: 'newpass',
        name: 'Duplicate',
        email: 'duplicate@example.com',
        rank: 0,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', 'User already exists');
    expect(mail.send).not.toHaveBeenCalled();
  });

  // --- New input validation tests below ---

  it('should reject if user field is missing', async () => {
    const { user, ...data } = validUser;
    const res = await request(app).post('/api/register').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should reject if password field is missing', async () => {
    const { password, ...data } = validUser;
    const res = await request(app).post('/api/register').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should reject if name field is missing', async () => {
    const { name, ...data } = validUser;
    const res = await request(app).post('/api/register').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should reject if email field is missing', async () => {
    const { email, ...data } = validUser;
    const res = await request(app).post('/api/register').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should reject if rank field is missing', async () => {
    const { rank, ...data } = validUser;
    const res = await request(app).post('/api/register').send(data);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should reject empty strings for required fields', async () => {
    const res = await request(app).post('/api/register').send({
      user: '',
      password: '',
      name: '',
      email: '',
      rank: 0,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should reject invalid email formats', async () => {
    const res = await request(app).post('/api/register').send({
      user: 'badEmail',
      password: 'Password123!',
      name: 'Bad Email',
      email: 'invalid-email',
      rank: 0,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid email/i);
  });

  it('should reject negative rank values', async () => {
    const res = await request(app).post('/api/register').send({
      user: 'negRank',
      password: 'Password123!',
      name: 'Negative Rank',
      email: 'neg@example.com',
      rank: -1,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should reject rank that is not a number', async () => {
    const res = await request(app).post('/api/register').send({
      user: 'rankString',
      password: 'Password123!',
      name: 'Rank String',
      email: 'rankstring@example.com',
      rank: 'high',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid|missing/i);
  });

  it('should handle email sending errors gracefully', async () => {
    mail.send.mockRejectedValueOnce(new Error('SendGrid failed'));

    const res = await request(app).post('/api/register').send({
      user: 'emailErrorUser',
      password: 'pass1234',
      name: 'Email Fail',
      email: 'fail@example.com',
      rank: 0,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('error', '');
    expect(mail.send).toHaveBeenCalledTimes(1);
  });
});