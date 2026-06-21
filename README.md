# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## Shorty – URL Shortener and Link Analytics Platform

**Version:** 1.0  
**Prepared By:** Ahsan Ahmed Saif  

**Frontend:** https://shorty-lyart.vercel.app  
**Backend API:** https://shorty-offu.onrender.com  
**API Documentation:** https://shorty-offu.onrender.com/docs  

---

# 1. Introduction

## 1.1 Purpose

Shorty is a web-based URL shortening platform that allows users to create shortened URLs, manage links, generate QR codes, and monitor click analytics.

The platform aims to provide a fast, scalable, and user-friendly solution for shortening and tracking URLs.

---

## 1.2 Scope

The system provides:

- User Registration  
- User Authentication  
- URL Shortening  
- Click Tracking  
- QR Code Generation  
- Link Search  
- Link Sorting  
- Link Deletion  
- Pagination  
- Responsive Dashboard  
- Dark/Light Theme  
- Redis-based Caching  

---

## 1.3 Intended Audience

- End Users  
- Developers  
- Software Engineering Instructors  
- Project Evaluators  

---

# 2. Overall Description

## 2.1 Product Perspective

Shorty is a full-stack web application consisting of:

- React Frontend  
- Go Backend API  
- PostgreSQL Database  
- Redis Cache  
- JWT Authentication  

---

## 2.2 Product Features

### Authentication
- User Registration  
- User Login  
- JWT Authorization  

### Link Management
- Create Short URLs  
- View URLs  
- Search URLs  
- Sort URLs  
- Delete URLs  

### Analytics
- Click Tracking  
- Total URLs  
- Total Clicks  
- Recent URLs  

### Utilities
- QR Code Generation  
- Copy to Clipboard  
- Pagination  
- Responsive Design  

---

# 3. System Architecture

Frontend (React + Vercel)  
↓  
Backend API (Go + Render)  
↓  
Redis Cache + PostgreSQL Database  

---

# 4. Functional Requirements

## FR-1 User Registration
Users shall be able to create an account.

Input:
- Email  
- Password  

Output:
- Successful Registration  
- Validation Errors  

---

## FR-2 User Login
Users shall be able to authenticate.

Output:
- JWT Token  

---

## FR-3 URL Shortening
Users shall be able to submit a long URL.

Output:
- Unique Short URL  

---

## FR-4 URL Redirection
When a shortened URL is accessed:
- Click count increases  
- User is redirected  

---

## FR-5 View URLs
Users shall view all URLs associated with their account.

Displayed:
- Original URL  
- Short URL  
- Click Count  
- Created Date  

---

## FR-6 Search URLs
Users shall search URLs using keywords.

---

## FR-7 Sort URLs
Sorting options:
- Newest  
- Oldest  
- Most Clicked  

---

## FR-8 QR Code Generation
Generate QR code for shortened URLs.

---

## FR-9 Delete URLs
Users shall remove URLs permanently.

---

## FR-10 Pagination
URLs shall be displayed in pages.

Limit:
- 10 URLs per page  

---

## FR-11 Dashboard Statistics
Dashboard shall display:
- Total URLs  
- Total Clicks  
- Recent URLs  

---

## FR-12 Theme Management
Support:
- Dark Mode  
- Light Mode  

---

## FR-13 Redis Caching
System shall cache frequently accessed data.

Benefits:
- Faster URL retrieval  
- Reduced database load  
- Improved scalability  

---

# 5. Non-Functional Requirements

## Performance
- Dashboard load time < 3 seconds  
- API response time < 1 second  

---

## Scalability
System supports:
- Thousands of users  
- Thousands of URLs  

Redis caching reduces database load.

---

## Security
- JWT Authentication  
- Password Hashing  
- Protected Endpoints  
- User Data Isolation  

---

## Reliability
- Error handling  
- Loading states  
- User notifications  

---

## Usability
- Responsive design  
- Mobile compatibility  
- Modern UI  

---

# 6. Database Design

## Users Table

| Field | Type |
|------|------|
| id | TEXT (PRIMARY KEY) |
| email | TEXT (UNIQUE, NOT NULL) |
| password_hash | TEXT (NOT NULL) |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP |

---

## URLs Table

| Field | Type |
|------|------|
| id | TEXT (PRIMARY KEY) |
| original_url | TEXT (NOT NULL) |
| user_id | TEXT (NOT NULL, FOREIGN KEY) |
| clicks | INTEGER DEFAULT 0 |
| created_at | TIMESTAMP DEFAULT CURRENT_TIMESTAMP |

---

### Constraints
- users(id) PRIMARY KEY  
- users(email) UNIQUE  
- urls(id) PRIMARY KEY  
- urls(user_id) FOREIGN KEY → users(id)  

---

### Indexes
- idx_users_email (email)  
- idx_urls_user_id (user_id)  

---

# 7. ER Diagram

USERS (1) ─────── (N) URLS

- users.id → urls.user_id  

---

# 8. Use Case Diagram

User:
- Register  
- Login  
- Create URL  
- Search URL  
- Delete URL  
- Generate QR  
- View Stats  

---

# 9. Technology Stack

## Frontend
- React.js  
- Vite  
- Tailwind CSS  
- React Router DOM  
- React Icons  
- React Hot Toast  

## Backend
- Go (Golang)  
- PostgreSQL  
- Redis  
- JWT Authentication  
- Swagger  

## Deployment
- Frontend: Vercel  
- Backend: Render  
- API Docs: Swagger  

---

# 10. Future Enhancements

- Custom Alias URLs  
- Link Expiration  
- Public Landing Page  
- Geographic Analytics  
- Device Analytics  
- Export Reports  
- Team Collaboration  

---

# 11. Conclusion

Shorty is a scalable URL shortening and analytics platform built using React, Go, PostgreSQL, and Redis. It provides secure authentication, efficient URL management, real-time analytics, and high performance through caching and optimized backend design.
