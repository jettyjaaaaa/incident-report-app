# 🚨 Incident Report App

A full-stack incident management system built with Go, React (TypeScript), and PostgreSQL.  
Designed as a production-ready internship technical assignment.

🔗 Live Demo: https://incident-report.jettyjaaaaa.space  

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Go (Gin)
- PostgreSQL
- pgx connection pool
- Clean Architecture (Repository → Service → Handler)

### Database
- Supabase PostgreSQL

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → Supabase
- Domain + SSL → Cloudflare

---

## 🏗 Architecture
Client (React + Vercel)
│
▼
Backend API (Go + Render)
│
▼
PostgreSQL (Supabase)

---

## ✨ Features

### Core
- Create Incident
- Edit Incident
- Delete Incident (Soft Delete)
- Restore Incident
- View Deleted History

### Advanced
- Search (ILIKE)
- Filter by Status
- Sort by Created / Updated
- Pagination support
- Auto purge after 1 month (cron job)

---

## 📊 Data Model

id
title
description
category (safety | maintenance)
status (open | in_progress | success)

created_by
created_at
updated_at

deleted_at
deleted_by

---

## 🚀 Local Setup
---

### 1️⃣ Clone Repository

git clone https://github.com/your-username/incident-report-app.git
cd incident-report-app
---

### 2️⃣ Backend Setup
cd backend
go mod tidy
cp .env.example .env
Edit .env:

DATABASE_URL=postgresql://...
CORS_ORIGIN=http://localhost:5173
PORT=8080
MAINTENANCE_SECRET=dev-secret

Run:
go run ./cmd/server

API:
http://localhost:8080/incidents

---

### 3️⃣ Frontend Setup
cd frontend
npm install

Create .env:
VITE_API_URL=http://localhost:8080

Run frontend:
npm run dev

Open:
http://localhost:5173

---
## 🌐 Deployment
---
### Backend (Render)
Configuration:
- Root directory: backend
- Build command: go build -o app ./cmd/server
- Start command: ./app
- Environment variables:
- DATABASE_URL
- CORS_ORIGIN
- PORT
- MAINTENANCE_SECRET
---
### Frontend (Vercel)
Configuration:
- Root directory: frontend
- Build command: npm run build
- Output directory: dist
- Environment variables:
- VITE_API_URL=https://incident-api.onrender.com
---
### Database (Supabase)
- PostgreSQL managed service
- Connection pooling enabled
- SSL required
- Used for production data storage
---
### Domain & SSL (Cloudflare)
- Custom domain: incident-report.jettyjaaaaa.space
- DNS managed via Cloudflare
- SSL auto-enabled via Cloudflare + Vercel

