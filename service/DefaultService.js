'use strict';

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET || 'SECRET_KEY';
const usersFile = path.join(__dirname, '../data/users.json');

/**
 * Read users from the JSON file. If file doesn't exist, create it.
 * @returns {Array<Object>} List of users
 */
function readUsers() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]', 'utf-8');
  }
  const raw = fs.readFileSync(usersFile, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Write the given users array to the JSON file.
 * @param {Array<Object>} users - List of user objects to write
 */
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
}

/**
 * Register a new user
 * @route POST /register
 * @body {string} name
 * @body {string} email
 * @body {string} password
 */
exports.register = function (req, res) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const users = readUsers();

  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  bcrypt.hash(password, 10)
    .then(hashedPassword => {
      const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        email,
        password: hashedPassword,
        name
      };

      users.push(newUser);
      writeUsers(users);

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        SECRET_KEY,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      });

      res.status(201).json({
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token
      });
    })
    .catch(err => res.status(500).json({ message: 'Server error: ' + err.message }));
};

/**
 * Login a user
 * @route POST /login
 * @body {string} email
 * @body {string} password
 */
exports.login = function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const users = readUsers();
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  bcrypt.compare(password, user.password)
    .then(isMatch => {
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000
      });

      res.json({
        userId: user.id,
        name: user.name,
        email: user.email,
        token
      });
    })
    .catch(err => res.status(500).json({ message: 'Server error: ' + err.message }));
};

/**
 * Perform a math operation on two numbers
 * @param {Object} body - The request body containing two numbers
 * @param {string} operation - One of: add, subtract, multiply, divide
 * @returns {Promise<Object>} A promise that resolves with the result
 */
exports.calculate = function (body, operation) {
  return new Promise((resolve, reject) => {
    let { number1, number2 } = body;

    number1 = Number(number1);
    number2 = Number(number2);

    if (isNaN(number1) || isNaN(number2)) {
      return reject({
        status: 400,
        message: 'Both numbers must be numeric'
      });
    }

    if (operation === 'divide' && number2 === 0) {
      return reject({
        status: 400,
        message: 'Cannot divide by zero'
      });
    }

    let result;
    switch (operation) {
      case 'add':
        result = number1 + number2;
        break;
      case 'subtract':
        result = number1 - number2;
        break;
      case 'multiply':
        result = number1 * number2;
        break;
      case 'divide':
        result = number1 / number2;
        break;
      default:
        return reject({
          status: 400,
          message: 'Invalid operation. Supported: add, subtract, multiply, divide'
        });
    }

    resolve({ result });
  });
};
