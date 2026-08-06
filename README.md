<div align="center">

<img src="./frontend/public/logo.png" alt="Shorty Logo" width="120"/>

# 🚀 Shorty

### Modern URL Shortener & Link Management Platform

Fast • Secure • Scalable

<p>

<a href="https://shorty-lyart.vercel.app">
🌐 Live Demo
</a>
•
<a href="https://shorty-offu.onrender.com/docs">
📖 API Documentation
</a>
•
<a href="https://github.com/Saif724/Shorty">
💻 Source Code
</a>

</p>

<p>

<img src="https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go"/>

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react"/>

<img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql"/>

<img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis"/>

<img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css"/>

<img src="https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?style=for-the-badge&logo=swagger"/>

<img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge"/>

</p>

</div>

---

# 📌 Overview

**Shorty** is a modern full-stack URL Shortener and Link Management Platform built with **Go**, **React**, **PostgreSQL**, and **Redis**.

The platform allows authenticated users to create shortened URLs, organize and manage links through a responsive dashboard, generate QR codes, and monitor click counts. It follows a layered backend architecture, utilizes Redis caching for improved performance, and secures all protected endpoints using JWT authentication.

Designed with scalability and simplicity in mind, Shorty demonstrates modern backend development practices while providing a clean and intuitive user experience.

---

# 🖼️ Preview

<p align="center">

<img src="./frontend/public/landing.png" width="95%"/>

</p>

<p align="center">

<img src="./frontend/public/dashboard-preview.png" width="95%"/>

</p>

<p align="center">

<img src="./frontend/public/details.png" width="95%"/>

</p>

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing (bcrypt)
- Protected API Routes

---

## 🔗 URL Management

- Create Short URLs
- Search URLs
- Sort URLs
- Delete URLs
- Copy URLs
- QR Code Generation
- Pagination

---

## 📊 Dashboard

- Total URLs
- Total Clicks
- Recent URLs
- URL Details
- Click Count per Link

---

## ⚡ Performance

- Redis Caching
- PostgreSQL Database
- Rate Limiting
- Optimized API Responses

---

## 🎨 User Experience

- Responsive Design
- Dark / Light Theme
- Toast Notifications
- Loading States
- Clean Modern Interface

---

# 🏗️ System Architecture

Shorty follows a layered architecture that separates business logic, request handling, and data access, making the application maintainable and scalable.

```text
                    React Frontend
                           │
                           ▼
                    REST API (Go)
                           │
                     Middleware Layer
        (JWT • Logger • Request ID • Rate Limiter • CORS)
                           │
                           ▼
                        Handlers
                           │
                           ▼
                        Services
                           │
                           ▼
                         Stores
                   (Database Layer)
                     │            │
                     ▼            ▼
              PostgreSQL       Redis
```

### Architecture Layers

| Layer | Responsibility |
|------|----------------|
| Frontend | User Interface built with React |
| Middleware | Authentication, logging, rate limiting, CORS |
| Handler | Receives HTTP requests and returns responses |
| Service | Business logic |
| Store | Database operations |
| PostgreSQL | Persistent data storage |
| Redis | URL caching for faster redirects |

---

# ⚙️ Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- React Hot Toast
- React Icons

---

## Backend

- Go (Golang)
- JWT Authentication
- REST API
- OpenAPI (Swagger UI)

---

## Database

- PostgreSQL
- Redis Cache

---

## Deployment

- Vercel (Frontend)
- Render (Backend)

---

# 📂 Project Structure

```text
Shorty
│
├── backend
│   ├── cmd
│   │   └── main.go
│   │
│   ├── internal
│   │   ├── cache
│   │   ├── config
│   │   ├── middleware
│   │   ├── migrate
│   │   ├── url
│   │   └── user
│   │
│   ├── openapi.yaml
│   ├── go.mod
│   └── Dockerfile
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   └── utils
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🚀 Core Features

- 🔐 JWT Authentication
- 🔗 URL Shortening
- 📊 Click Counting
- 📱 Responsive Dashboard
- 🌙 Dark / Light Theme
- 📄 Swagger Documentation
- ⚡ Redis Caching
- 🔍 Search & Sorting
- 📄 Pagination
- 📋 Copy to Clipboard
- 📱 QR Code Generation
- 🗑️ URL Deletion

---

# 🔄 Request Flow

```text
User
 │
 ▼
React Frontend
 │
 ▼
Go REST API
 │
 ▼
Authentication Middleware
 │
 ▼
Business Logic
 │
 ├─────────────► Redis Cache
 │
 ▼
PostgreSQL
 │
 ▼
JSON Response
 │
 ▼
Frontend
```

---

# ⚙️ Getting Started

## Prerequisites

Before running the project, make sure you have the following installed:

- Go 1.24+
- Node.js 20+
- PostgreSQL
- Redis
- Git

---

# 📥 Installation

## Clone the repository

```bash
git clone https://github.com/Saif724/url-shortener.git

cd Shorty
```

---

## Backend Setup

```bash
cd backend

go mod download

go run cmd/main.go
```

The backend will start on:

```
http://localhost:8080
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

The frontend will start on:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=8080

DB_URL=postgres://username:password@localhost:5432/shorty?sslmode=disable

REDIS_URL=redis://localhost:6379

JWT_SECRET=your_secret_key
```

---

# 📖 API Reference

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user |
| POST | `/shorten` | Create a short URL |
| GET | `/r/{id}` | Redirect to original URL |
| GET | `/user/urls` | Get all user URLs |
| DELETE | `/user/urls/{id}` | Delete a URL |

---

# 📚 API Documentation

Interactive Swagger documentation is available at:

### Production

https://shorty-offu.onrender.com/docs

### Local

http://localhost:8080/docs

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL |
| Cache | Redis |

---

# 🛣️ Roadmap

## ✅ Completed

- JWT Authentication
- URL Shortening
- Click Tracking
- Dashboard
- URL Details
- QR Code Generation
- Search URLs
- Sort URLs
- Pagination
- Redis Caching
- Rate Limiting
- Swagger Documentation
- Responsive Design
- Dark / Light Theme

---

## 🔮 Planned Features

- Custom URL Aliases
- Link Expiration
- Advanced Click Analytics
- Geographic Analytics
- Device Analytics
- Export Reports
- Team Workspaces
- Admin Dashboard

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Ahsan Ahmed Saif**

- GitHub: https://github.com/Saif724

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.

---

# 📄 License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.
