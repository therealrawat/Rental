# Landlord Rental Management App (Full Stack)

Monorepo containing:

- `frontend/`: React (Vite) app
- `backend/`: Node/Express API with MongoDB + JWT auth

## Prerequisites

- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas connection string

## Setup

### 1) Backend

```bash
cd landlord-app/backend
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend

```bash
cd landlord-app/frontend
npm install
cp .env.example .env
npm run dev
```

## Phase 1

- Auth (register/login/logout)
- Dashboard metrics (basic)
- Properties list/create
- Tenants list/create

