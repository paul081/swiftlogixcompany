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


> [!IMPORTANT]
> **Consolidated Project Structure for Vercel Deployment**
> To fix the **404: NOT_FOUND** and routing errors in production, the project has been updated:
> 1. The **`backend/`** folder and **`vercel.json`** have been moved into the **`frontend/`** directory.
> 2. This allows Vercel to correctly detect the Next.js app while still serving the API functions from the backend.
> 3. **Production URL:** [https://swiftlogix.vercel.app](https://swiftlogix.vercel.app)

---

### How to Run Locally

#### Frontend & Backend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs Next.js at localhost:3000)

#### Backend Alone (Optional)
1. `cd frontend/backend`
2. `npm run dev` (Runs Express at localhost:5000)

## Default Admin Setup
1. Use the backend API to create an admin user or seed it in MongoDB.
2. Login at `/login` to access the Admin Console.
