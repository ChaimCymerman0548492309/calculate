בשמחה! הנה קובץ `README.md` מפורט, מקצועי וויזואלי, הכולל:

* תאור כללי של המערכת
* טבלת Endpoints
* איך להפעיל את השרת
* איך לבדוק עם Postman
* פירוט בדיקות (✅, ❌)
* בדיקות JWT
* מבנה הקוד
* קבצי עזר
* Unit Tests
* תיעוד לכל הדרישות

---

### 📄 README.md — Full API Documentation

````markdown
# 📐 Calculator API

A secure and documented RESTful API built with **Node.js + Express**, allowing authenticated users to perform basic math operations.  
The API supports **JWT authentication** via Bearer Token or `httpOnly` cookie, and is documented using **OpenAPI (Swagger)**.

---

## 🧠 Features Overview

| Feature                          | Status | Description |
|----------------------------------|--------|-------------|
| 📬 POST endpoint for calculation | ✅     | `/calculate` performs arithmetic |
| 🔐 JWT-based Auth                | ✅     | Bearer Token or cookie |
| 🧾 Swagger documentation         | ✅     | Available at `/docs` |
| 📂 YAML-based API definition     | ✅     | `openapi.yaml` |
| ✅ Header-based operation input  | ✅     | `operation` required in HTTP header |
| 🧪 Unit Tests                    | ✅     | Jest + Supertest |
| 💾 Local JSON file storage       | ✅     | `users.json` used for user management |

---

## 🚀 Getting Started

### 🔧 Installation

```bash
git clone https://github.com/your-username/calculator-api.git
cd calculator-api
npm install
````

### 🔐 Environment Variables

Create a `.env` file or set in your environment:

```env
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

## ▶️ Running the Server

```bash
npm start
```

The server will be available at:
📡 [http://localhost:8080](http://localhost:8080)
📚 Swagger UI: [http://localhost:8080/docs](http://localhost:8080/docs)

---

## 📬 API Endpoints

| Method | Endpoint     | Description              | Auth Required | Notes                       |
| ------ | ------------ | ------------------------ | ------------- | --------------------------- |
| POST   | `/register`  | Register a new user      | ❌             | Returns JWT                 |
| POST   | `/login`     | Login with credentials   | ❌             | Returns JWT                 |
| POST   | `/calculate` | Perform a math operation | ✅             | Requires `operation` header |

---

## 📊 Supported Operations

| Header: `operation` | Description       |
| ------------------- | ----------------- |
| `add`               | ➕ Addition        |
| `subtract`          | ➖ Subtraction     |
| `multiply`          | ✖️ Multiplication |
| `divide`            | ➗ Division        |

---

## 🛡️ Authentication

* **JWT Token** is required for `/calculate`
* Send in:

  * Header: `Authorization: Bearer <token>`
  * OR as httpOnly cookie: `token=...`

Token expires in **7 days**

---

## 🧪 Postman Testing Instructions

1. 🔹 **Register:**

```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "12345678",
  "name": "Alice"
}
```

2. 🔹 **Login:**

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "12345678"
}
```

3. 🔹 **Calculate (Authenticated):**

```http
POST /calculate
Authorization: Bearer <JWT>
operation: multiply
Content-Type: application/json

{
  "number1": 6,
  "number2": 7
}
```

4. 🔸 **Expected Errors:**

| Case                     | Status | Message                         |
| ------------------------ | ------ | ------------------------------- |
| No token                 | 401    | Unauthorized: No token provided |
| Expired token            | 401    | Unauthorized: Token expired     |
| Invalid operation header | 400    | Missing or invalid `operation`  |
| Divide by zero           | 400    | Cannot divide by zero           |
| Non-numeric inputs       | 400    | Both numbers must be numeric    |

---

## 🧪 Unit Testing

Run all tests:

```bash
npm test
```

Test coverage includes:

* ✅ Successful registration & login
* ✅ JWT validation (valid, expired, invalid)
* ✅ All 4 operations
* ✅ Missing/invalid headers
* ✅ Edge cases like divide-by-zero

---

## 🧱 Project Structure

```
.
├── api/
│   └── openapi.yaml         # Swagger API definition
├── controllers/
│   └── AuthService.js       # Login, register, calculate
├── data/
│   └── users.json           # JSON-based user storage
├── tests/
│   ├── auth.test.js         # Tests for authentication
│   └── calculate.test.js    # Tests for calculation
├── index.js                 # Main Express app
├── package.json
└── README.md
```

---

## 📌 Design Decisions

* **Operation in Header**: Required by the spec, enforced in middleware
* **JWT via cookie or Authorization**: For flexibility and security
* **File-based storage**: To simplify deployment (no DB required)
* **Swagger-based design**: Auto-generated API documentation and server stub
* **Test coverage**: Ensures stability and correctness

---

## 📚 OpenAPI Documentation

* Defined in `api/openapi.yaml`
* Used by `oas3-tools` to configure routes and validation
* Swagger UI at: [http://localhost:8080/docs](http://localhost:8080/docs)

---

## ✅ Summary of Requirements

| Requirement                           | Status | Covered in          |
| ------------------------------------- | ------ | ------------------- |
| Node.js + Express REST API            | ✅      | `index.js`          |
| JWT-based authentication              | ✅      | `AuthService.js`    |
| Operation via HTTP Header             | ✅      | `calculatePost()`   |
| YAML-based OpenAPI definition         | ✅      | `api/openapi.yaml`  |
| Swagger UI for docs                   | ✅      | `/docs`             |
| Secure token handling (cookie/header) | ✅      | `index.js`          |
| File-based user persistence           | ✅      | `users.json`        |
| Unit tests with coverage              | ✅      | `jest`, `supertest` |
| Input validation + error handling     | ✅      | All controllers     |
| Clean code with documentation         | ✅      | JSDoc comments      |

---

## 🧑‍💻 Author

Chaim Cymerman
📧 [chaim@example.com](mailto:chaim@example.com)
📍 Israel
🔗 [LinkedIn](https://linkedin.com/in/your-profile)

---

## 🏁 Ready to Use!

✅ Fully functional
✅ Secure
✅ Documented
✅ Tested
✅ Meets all requirements

```

