// =============================
// File: calculate.test.js
// =============================
const path = require('path');
const fs = require('fs');
const request = require('supertest');
const http = require('http');
const appConfig = require('../index');
const jwt = require('jsonwebtoken');

describe('Calculation API Tests', () => {
  let server;
  let token;
  const createdUserIds = [];


beforeAll(async () => {
  server = http.createServer(appConfig);
  await new Promise((resolve) => server.listen(resolve));

  const user = {
    email: `calc_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Calc User'
  };

  const reg = await request(server).post('/register').send(user);
  console.log('REGISTER:', reg.body);
  expect(reg.statusCode).toBe(201);
createdUserIds.push(reg.body.userId);

  // ✅ המתן כדי לוודא שהמשתמש נכתב לקובץ
  await new Promise(resolve => setTimeout(resolve, 100));

  const login = await request(server).post('/login').send({
    email: user.email,
    password: user.password
  });
  console.log('LOGIN:', login.body);
  expect(login.statusCode).toBe(200);

  token = login.body.token;
});


afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));

  const usersFile = path.join(__dirname, '../data/users.json');

  if (fs.existsSync(usersFile)) {
    const raw = fs.readFileSync(usersFile, 'utf-8');
    const allUsers = JSON.parse(raw);

    // ❌ סנן את המשתמשים שנוצרו בטסטים
    const remainingUsers = allUsers.filter(
      (user) => !createdUserIds.includes(user.id)
    );

    // ✍️ כתוב מחדש את הקובץ רק עם המשתמשים שנשארו
    fs.writeFileSync(usersFile, JSON.stringify(remainingUsers, null, 2));
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

  it('should reject expired JWT token', async () => {
    const expiredToken = jwt.sign(
      { userId: 999, email: 'expired@example.com' },
      process.env.JWT_SECRET || 'SECRET_KEY',
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