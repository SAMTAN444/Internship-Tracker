# Trackly

Trackly is a production-ready full-stack web application that helps users manage internship applications, track progress, and stay organised throughout the recruitment journey.

---

## Live Application
**URL:** https://internship-tracker-beta.vercel.app/

*(Deployed and actively maintained)*

---

## Overview

Managing internship applications across spreadsheets, emails, and reminders quickly becomes fragmented and inefficient. Important deadlines are missed, application statuses become outdated, and there is no clear overview of progress.

Trackly was built to serve as a **single source of truth** for internship applications, enabling users to track applications end-to-end — from submission to final outcome — through a clean and intuitive dashboard.

---

## Core Features

- Secure user authentication (Register / Login / Logout)
- User-specific internship tracking (data isolated per account)
- Create, edit, and delete internship entries
- Application status management (Applied, Interviewing, Offer, Rejected, Archived)
- Batch status updates for multiple entries
- Reminder system to prevent missed follow-ups and deadlines
- Pagination and filtering for scalable data handling
- Responsive, mobile-friendly UI

---

## Engineering Highlights

- Clear separation of concerns across frontend, backend, and data layers
- Modular backend architecture using controllers, routes, middleware, and models
- RESTful API design with predictable and maintainable endpoints
- Stateless authentication using JWT for scalability
- Optimistic UI updates to improve responsiveness
- Defensive error handling with clear user feedback

The focus of this project was on **maintainability, clarity, and real-world usability**, rather than over-engineering.

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### DevOps & Tooling
- Git & GitHub (feature-branch workflow)
- Vercel (Frontend deployment)
- Render (Backend deployment)
- Environment-based configuration for secrets

---

## System Architecture

React Client
↓
REST API (Express.js)
↓
MongoDB Database

- Frontend communicates with backend via REST APIs
- Backend handles authentication, validation, and business logic
- Database persists user-specific internship and reminder data

---

## Authentication & Security

- Passwords are hashed before storage
- JWT used for secure, stateless authentication
- Protected routes enforced on both frontend and backend
- User data strictly scoped to authenticated users
- Sensitive credentials managed via environment variables

---

## Project Structure
client/
- src/
  - components/
  - pages/
  - services/
  - routes/

server/
- controllers/
- routes/
- models/
- middleware/
- config/

---

## Testing & Code Quality

- Manual testing across all major user flows
- Consistent code formatting and linting
- Centralised error handling for predictable behaviour

*(Automated testing planned as a future improvement.)*

---

## Challenges & Learnings

- Designing scalable data models that support pagination and batch updates
- Managing authenticated state across protected frontend routes
- Maintaining clean API boundaries between frontend and backend
- Balancing rapid feature development with long-term code quality

This project strengthened my understanding of **end-to-end system design**, beyond individual features.

---

## Future Improvements

- Automated unit and integration testing
- Role-based access control
- Advanced analytics and insights dashboard
- Background job processing for reminders
- Enhanced notification delivery mechanisms

---

## Author

**Samuel Tan**  
Computer Science Undergraduate

- GitHub: https://github.com/SAMTAN444
- LinkedIn: https://linkedin.com/in/samuel-tann

---

### Why Trackly

Trackly reflects real-world engineering trade-offs: building software that is **useful, maintainable, and production-ready**, while remaining clean, readable, and scalable.
