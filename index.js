'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const oas3Tools = require('oas3-tools');

const app = express();
app.use(cookieParser());

/**
 * Middleware for JWT authentication.
 * Skips authentication for public routes.
 */
app.use((req, res, next) => {
  const publicPaths = ['/docs', '/openapi.json', '/register', '/login'];
  if (publicPaths.includes(req.path)) return next();

  const token =
    req.headers.authorization?.split(' ')[1] ||
    req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');
    req.user = decoded;
    next();
  } catch (err) {
    
    return res.status(401).json({
      message: err.name === 'TokenExpiredError'
        ? 'Unauthorized: Token expired'
        : 'Unauthorized: Invalid token'
    });
  }
});

/**
 * Middleware to ensure 'operation' header is present for /calculate route.
 */
app.use((req, res, next) => {
  if (req.path === '/calculate' && req.method === 'POST') {
    const operation = req.headers['operation'];
    if (!operation) {
      return res.status(400).json({
        message: 'Missing required "operation" header'
      });
    }
  }
  next();
});

// Swagger router configuration
const options = {
  routing: {
    controllers: path.join(__dirname, './controllers'),
    useStubs: process.env.NODE_ENV === 'development'
  }
};

// Create express app from OpenAPI YAML definition
const expressAppConfig = oas3Tools.expressAppConfig(
  path.join(__dirname, 'api/openapi.yaml'),
  options
);

const configuredApp = expressAppConfig.getApp();

// Attach the OpenAPI-configured app
app.use(configuredApp);

// Start the server
if (require.main === module) {
  const http = require('http');
  const serverPort = 8080;
  http.createServer(app).listen(serverPort, () => {
    console.log(`Your server is listening on http://localhost:${serverPort}`);
    console.log(`Swagger UI is available at http://localhost:${serverPort}/docs`);
  });
}

module.exports = app;


