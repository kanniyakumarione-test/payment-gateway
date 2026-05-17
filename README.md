# Payment Gateway Monorepo

This repository contains:

- `frontend/`: Vite + React application
- `backend/`: Express API service

## Quick Start

1. Copy env templates and fill values:
   - `frontend/.env.example` -> `frontend/.env`
   - `backend/.env.example` -> `backend/.env`
2. Install dependencies:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
3. Run services:
   - Frontend: `npm run dev` (inside `frontend`)
   - Backend: `npm run dev` (inside `backend`)

## Deployment

- Frontend and backend include `vercel.json`.
- Ensure all required environment variables are set in Vercel project settings.
