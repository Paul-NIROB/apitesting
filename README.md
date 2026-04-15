# 🚀 Task Manager Backend Assignment

## 📌 Project Overview

This project is a scalable REST API with authentication and role-based access control. It allows users to manage tasks securely while providing admin-level control over all resources.

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* bcrypt

### Frontend

* React.js (Vite)
* Axios

---

## 🔐 Features

* User Registration & Login (JWT आधारित authentication)
* Role-Based Access Control (User / Admin)
* Secure Password Hashing (bcrypt)
* Task CRUD Operations
* Protected Routes using JWT middleware
* API Versioning (/api/v1)
* Input Validation & Error Handling

---

## 📡 API Endpoints

### Auth Routes

* POST `/api/v1/auth/register`
* POST `/api/v1/auth/login`

### Task Routes

* GET `/api/v1/tasks`
* POST `/api/v1/tasks`
* PUT `/api/v1/tasks/:id`
* DELETE `/api/v1/tasks/:id`

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/task-manager-backend-assignment.git
cd task-manager-backend-assignment
```

### 2. Install dependencies

```
npm install
```

### 3. Setup environment variables

Create a `.env` file in root:

```
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskdb"
JWT_SECRET="your_secret"
JWT_EXPIRES_IN="1h"
BCRYPT_ROUNDS=10
```

### 4. Run database migrations

```
npx prisma migrate dev --name init
```

### 5. Start the server

```
npm run dev
```

---

## 🧪 API Testing

* Use Swagger or Postman
* Test authentication and protected routes
* Include JWT token in headers:

```
Authorization: Bearer <token>
```

---

## 🎨 Frontend Usage

* Register and login users
* Store JWT in localStorage
* Access dashboard
* Perform CRUD operations on tasks

---

## 🔒 Security Measures

* Password hashing using bcrypt
* JWT-based authentication
* Input validation
* Protected routes
* Environment variables for sensitive data

---

## 📈 Scalability Note

The project follows a modular architecture which allows easy transition into microservices. Services like authentication, user management, and task handling can be separated. For scalability, caching mechanisms like Redis can be added, along with load balancing and containerization using Docker and Kubernetes.

---

## 📦 Folder Structure

```
backend/
 ├── controllers/
 ├── routes/
 ├── middleware/
 ├── models/
 ├── services/
 ├── config/
 └── app.js

frontend/
 ├── components/
 ├── pages/
 ├── services/
 └── App.jsx
```

---

## 👨‍💻 Author

Nirob Paul

---

## ✅ Status

✔ Completed and ready for submission
