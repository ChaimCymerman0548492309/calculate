// =============================
// File: calculate.test.js
// =============================

const request = require('supertest');
const http = require('http');
const appConfig = require('../index');

describe('Calculation API Tests', () => {
  let server;
  let token;
  const createdUserIds = [];

  beforeAll((done) => {
    server = http.createServer(appConfig);
    server.listen(async () => {
      const user = {
        email: `calc_${Date.now()}@example.com`,
        password: 'password123',
        name: 'Calc User'
      };

      const reg = await request(server).post('/register').send(user);
      expect(reg.statusCode).toBe(201);
      createdUserIds.push(reg.body.userId);

      const login = await request(server).post('/login').send({
        email: user.email,
        password: user.password
      });

      token = login.body.token;
      done();
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    
    // Clean up created users
    for (const userId of createdUserIds) {
      try {
        await request(server)
          .delete(`/users/${userId}`)
          .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN || ''}`);
      } catch (err) {
        console.warn(`Could not delete user ${userId}`);
      }
    }
  });

  it('should return result for subtraction', async () => {
    const res = await request(server)
      .post('/calculate')
      .set('Authorization', `Bearer ${token}`)
      .set('operation', 'subtract')
      .send({ number1: 10, number2: 4 });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(6);
  });

  it('should return result for multiplication', async () => {
    const res = await request(server)
      .post('/calculate')
      .set('Authorization', `Bearer ${token}`)
      .set('operation', 'multiply')
      .send({ number1: 3, number2: 4 });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(12);
  });

  it('should return 400 when operation is missing from header', async () => {
    const res = await request(server)
      .post('/calculate')
      .set('Authorization', `Bearer ${token}`)
      .send({ number1: 10, number2: 2 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid number types', async () => {
    const res = await request(server)
      .post('/calculate')
      .set('Authorization', `Bearer ${token}`)
      .set('operation', 'add')
      .send({ number1: "abc", number2: 2 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(server)
      .post('/calculate')
      .set('operation', 'add')
      .send({ number1: 1, number2: 2 });

    expect(res.statusCode).toBe(401);
  });
});