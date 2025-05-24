# 🧮 Calculator API

> A secure, JWT-authenticated RESTful API for mathematical operations built with Node.js and Express

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication with Bearer tokens or httpOnly cookies
- 📊 **Mathematical Operations** - Support for addition, subtraction, multiplication, and division
- 📚 **OpenAPI Documentation** - Complete Swagger UI documentation
- 🧪 **Comprehensive Testing** - Full test coverage with Jest and Supertest
- 🛡️ **Input Validation** - Robust error handling and validation
- 💾 **File-based Storage** - Simple JSON-based user management

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/calculator-api.git
cd calculator-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your JWT secret
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
JWT_SECRET=SECRET_KEY
NODE_ENV=development
PORT=8080
```

### Running the Application

```bash
# Start the server
npm start

# For development with auto-reload
npm run dev
```

🌐 **Server:** http://localhost:8080  
📖 **API Documentation:** http://localhost:8080/docs

---

## 📋 API Reference

### Authentication Endpoints

| Method | Endpoint    | Description       | Auth Required |
|--------|-------------|-------------------|---------------|
| POST   | `/register` | Create new user   | ❌            |
| POST   | `/login`    | User login        | ❌            |

### Calculator Endpoints

| Method | Endpoint     | Description              | Auth Required | Special Headers |
|--------|--------------|--------------------------|---------------|-----------------|
| POST   | `/calculate` | Perform math operations  | ✅            | `operation`     |

### Supported Operations

Send the operation type in the `operation` header:

| Operation   | Header Value | Symbol | Example          |
|-------------|--------------|--------|------------------|
| Addition    | `add`        | ➕     | 5 + 3 = 8        |
| Subtraction | `subtract`   | ➖     | 10 - 4 = 6       |
| Multiply    | `multiply`   | ✖️     | 6 × 7 = 42       |
| Division    | `divide`     | ➗     | 15 ÷ 3 = 5       |

---

## 🔧 Usage Examples

### 1. Register a New User

```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Perform Calculations

```http
POST /calculate
Authorization: Bearer <your-jwt-token>
operation: multiply
Content-Type: application/json

{
  "number1": 15,
  "number2": 4
}
```

**Response:**
```json
{
  "result": 60,
  "operation": "multiply",
  "operands": [15, 4]
}
```

---

## 🛡️ Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. After login or registration, include the token in your requests using one of these methods:

### Method 1: Authorization Header
```http
Authorization: Bearer <your-jwt-token>
```

### Method 2: HTTP-Only Cookie
The token can also be sent as a secure httpOnly cookie named `token`.

**Token Expiration:** 7 days

---

## ⚠️ Error Handling

| Status Code | Scenario                    | Response Example                              |
|-------------|-----------------------------|-----------------------------------------------|
| 400         | Missing operation header    | `{"error": "Missing or invalid operation"}`   |
| 400         | Division by zero            | `{"error": "Cannot divide by zero"}`          |
| 400         | Invalid input               | `{"error": "Both numbers must be numeric"}`   |
| 401         | No token provided           | `{"error": "Unauthorized: No token provided"}`|
| 401         | Invalid/expired token       | `{"error": "Unauthorized: Token expired"}`    |
| 500         | Server error                | `{"error": "Internal server error"}`          |

---

## 🧪 Testing

### Run All Tests

```bash
# Run test suite
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Areas

- ✅ User registration and login
- ✅ JWT token validation (valid, expired, malformed)
- ✅ All mathematical operations
- ✅ Header validation and missing headers
- ✅ Edge cases (division by zero, invalid inputs)
- ✅ Error handling and status codes

---

## 📁 Project Structure

```
calculator-api/
├── 📁 api/
│   └── openapi.yaml         # OpenAPI 3.0 specification
├── 📁 controllers/
│   └── AuthService.js       # Authentication & calculation logic
├── 📁 data/
│   └── users.json          # User data storage
├── 📁 tests/
│   ├── auth.test.js        # Authentication tests
│   └── calculate.test.js   # Calculation tests
├── 📁 middleware/
│   └── auth.js             # JWT middleware
├── index.js                # Main application entry point
├── package.json
├── .env.example
└── README.md
```

---

## 🔧 Technical Details

### Dependencies

**Core:**
- `express` - Web framework
- `jsonwebtoken` - JWT implementation
- `bcrypt` - Password hashing
- `cors` - Cross-origin resource sharing

**Documentation:**
- `oas3-tools` - OpenAPI tools
- `swagger-ui-express` - Swagger UI

**Testing:**
- `jest` - Testing framework
- `supertest` - HTTP testing

### Security Features

- 🔐 Password hashing with bcrypt
- 🛡️ JWT token expiration
- 🍪 Secure httpOnly cookies
- ✅ Input validation and sanitization
- 🚫 Protection against common vulnerabilities

---

## 📖 API Documentation

Interactive API documentation is available via Swagger UI:

🔗 **Local:** http://localhost:8080/docs  
📄 **OpenAPI Spec:** `/api/openapi.yaml`

The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Authentication requirements
- Interactive testing interface

---

## ✅ Requirements Checklist

| Requirement                              | Status | Implementation          |
|------------------------------------------|--------|-------------------------|
| Node.js + Express REST API               | ✅     | `index.js`              |
| JWT-based authentication                 | ✅     | `AuthService.js`        |
| Operation parameter in HTTP header       | ✅     | `operation` header      |
| OpenAPI YAML specification               | ✅     | `api/openapi.yaml`      |
| Swagger UI documentation                 | ✅     | `/docs` endpoint        |
| Secure token handling                    | ✅     | Bearer/Cookie support   |
| File-based user storage                  | ✅     | `data/users.json`       |
| Comprehensive unit tests                 | ✅     | Jest + Supertest        |
| Input validation & error handling        | ✅     | All endpoints           |
| Clean, documented code                   | ✅     | JSDoc + comments        |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
---

## 🐳 Run with Docker & Docker Compose

### Prerequisites

- Docker
- Docker Compose

### Build & Run with Docker

```bash
docker build -t calculator-api .
docker run -p 8080:8080 calculator-api
```

### Run with Docker Compose

```bash
docker-compose up --build
```

> API: http://localhost:8080  
> Swagger UI: http://localhost:8080/docs

### Persisting User Data

Mount the `data/` folder as a volume in `docker-compose.yml`:

```yaml
volumes:
  - ./data:/app/data
```

---

## 📁 Project Structure

```
calculator-api/
├── api/
├── controllers/
├── data/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Chaim Cymerman**
- 📧 Email: chaim@example.com
- 🌍 Location: Israel
- 💼 LinkedIn: [linkedin.com/in/chaim-cymerman](https://linkedin.com/in/chaim-cymerman)

---

## 🙏 Acknowledgments

- Built with Node.js and Express
- JWT implementation using jsonwebtoken
- API documentation powered by OpenAPI 3.0
- Testing with Jest and Supertest

---

<div align="center">

**🎉 Ready to Calculate! 🎉**


*This API is production-ready, fully tested, and thoroughly documented.*

[⬆ Back to Top](#-calculator-api)

</div>