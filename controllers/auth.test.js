// =============================
// File: auth.test.js
// =============================

const request = require('supertest');
const http = require('http');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const appConfig = require('../index');

describe('Authentication API Tests', () => {
  let server;
  const createdUserIds = [];

beforeAll(async () => {
  server = http.createServer(appConfig);
  await new Promise((resolve) => server.listen(resolve));
});


  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));

    for (const userId of createdUserIds) {
      try {
        await request(server)
          .delete(`/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN || ''}`);
      } catch (err) {
        console.warn(`Could not delete user ${userId}`);
      }
    }

    const usersFile = path.join(__dirname, '../data/users.json');
    if (fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
  });

  it('should register and login a user successfully', async () => {
    const user = {
      email: `auth_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Auth User'
    };

    const reg = await request(server).post('/register').send(user);
    expect(reg.statusCode).toBe(201);
    createdUserIds.push(reg.body.userId);

    
    const login = await request(server).post('/login').send({
      email: user.email,
      password: user.password
    });

    expect(login.statusCode).toBe(200);
    expect(login.body).toHaveProperty('token');
  });

  it('should reject expired JWT token', async () => {
    const expiredToken = jwt.sign(
      { userId: 999, email: 'expired@example.com' },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '-10s' }
    );

    const res = await request(server)
      .post('/calculate')
      .set('Authorization', `Bearer ${expiredToken}`)
      .set('operation', 'add')
      .send({ number1: 1, number2: 2 });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/token expired/i);
  });

  it('should reject invalid JWT token', async () => {
    const fakeToken = 'invalid.token.parts';

    const res = await request(server)
      .post('/calculate')
      .set('Authorization', `Bearer ${fakeToken}`)
      .set('operation', 'add')
      .send({ number1: 1, number2: 2 });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });

  it('should not allow login with wrong email', async () => {
    const res = await request(server).post('/login').send({
      email: 'wrong@email.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(400);
  });

  it('should not allow registration with invalid email format', async () => {
    const res = await request(server).post('/register').send({
      email: 'not-an-email',
      password: '12345678',
      name: 'Invalid Email'
    });
    expect(res.statusCode).toBe(400);
  });

  it('should not allow registration with missing password', async () => {
    const res = await request(server).post('/register').send({
      email: 'missingpass@example.com',
      name: 'Missing Password'
    });
    expect(res.statusCode).toBe(400);
  });
});