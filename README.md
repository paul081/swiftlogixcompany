# SwiftLogix - Global Shipping & Tracking System

SwiftLogix is a premium full-stack application for managing logistics and package tracking.

## Features
- **Public Tracking**: Fast and beautiful interface for tracking packages with SLX IDs. Users do not need accounts; they are identified by their tracking numbers.
- **Admin Command Center**: Secure portal for logistics administrators to manage shipments and update statuses.
- **Micro-animations**: Powered by Framer Motion for a premium feel.
- **JWT Auth**: High-security authentication system for Admin access.
- **Docker Support**: Ready for cloud deployment.

## Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, Lucide Icons, Framer Motion, Axios.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **infra**: Docker, Docker Compose.

## How to Run

### Option 1: Manual Setup (Recommended)

#### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` (use example: `MONGO_URI=mongodb://localhost:27017/swiftlogix`, `JWT_SECRET=...`)
4. `npm run dev`

#### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Default Admin Setup
1. Use the backend API to create an admin user or seed it in MongoDB.
2. Login at `/login` to access the Admin Console.
