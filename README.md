# 📚 Advanced NestJS Library System with Branch & Role Management

This project is an enhanced version of a backend system for managing a digital library, developed using NestJS and MongoDB. It introduces advanced features like real-time branch inventory, CMS role management, book review systems, WebSocket-based live updates, and analytics dashboards.

---

## 🚀 Features

### 🧑‍💻 CMS (Admin/Intern)
- Admin can:
  - Create CMS users (Admin or Intern)
  - Approve/reject book requests from authors
  - Distribute books across branches
  - Track branch-level insights & analytics
- Intern can:
  - View dashboard
  - Distribute books

### 📖 Authors
- Added by CMS Admin
- Login with PIN sent via email
- Submit book requests (PDF, cover image, metadata)
- Track status of book approvals
- Get notified (via WebSocket) when their books are borrowed

### 👤 Members
- Sign up with email OTP
- Login and manage profile
- Borrow and return books
- Track return rate
- Submit and like reviews
- Get live updates on book availability (via WebSockets)

---

## 📊 Dashboard Analytics

- Total and overdue books
- Top 5 authors and books
- Borrow trends graph (daily/monthly)
- Branch-specific stats

---

## 🏗 Tech Stack

- **Backend Framework:** NestJS
- **Database:** MongoDB
- **Validation:** Joi
- **WebSockets:** `@nestjs/websockets`, `@nestjs/platform-socket.io`
- **Testing:** Jest (bonus)
- **Docs:** Postman, Obsidian
- **Architecture:** Modular, Clean MVC

---

## 📦 API Categories

- **Books:** Add, borrow, return, review, distribute
- **Authors:** Submit books, receive notifications
- **Members:** Register/login, borrow history, review system
- **Branches:** Inventory & book allocation
- **CMS:** User management, analytics, request approval

---

## 🔐 Role-Based Access

| Role    | Permissions |
|---------|-------------|
| Admin   | Full access |
| Intern  | View-only + distribute books |
| Author  | Submit books |
| Member  | Borrow, return, review |

---

## 📂 Documentation

-  **Postman Collection:** Includes folders and examples for all API endpoints.
-  **Test Data:** JSON files with exported schemas.
-  **Obsidian Notes:** System architecture & flow (optional bonus).

