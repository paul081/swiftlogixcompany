# 🚀 SwiftLogix Deployment Guide

This guide provides instructions for deploying the SwiftLogix platform to production.

## 📋 Prerequisites
- A GitHub account.
- A Vercel account (for Frontend).
- AWS / DigitalOcean account (for Backend & Database).
- Docker installed (for VPS deployment).

---

## 🎨 Frontend Deployment (Vercel)
Vercel is the recommended platform for the Next.js frontend.

1. **Connect Repository**: Import your `swiftlogix` repository to Vercel.
2. **Framework Preset**: Ensure it detects **Next.js**.
3. **Root Directory**: Set to `frontend`.
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://api.yourdomain.com/api`).
5. **Deploy**: Vercel will automatically build and serve your app.

---

## ⚙️ Backend Deployment (AWS / DigitalOcean)
The backend is Docker-ready for any VPS or Container Service.

### Approach 1: Docker Compose (Quickest for VPS)
1. **Provision VPS**: Create an Ubuntu/Debian droplet/instance.
2. **Install Docker**: Run `apt install docker.io docker-compose`.
3. **Copy Files**: Clone your repo or copy the `docker-compose.yml` and project folders.
4. **Configure Environment**: Update `docker-compose.yml` environment variables with production secrets.
5. **Run**: 
   ```bash
   docker-compose up -d --build
   ```

### Approach 2: Managed Container Services (AWS ECS / App Runner)
1. **CI/CD**: Set up a GitHub Action to build and push the backend Docker image to **AWS ECR**.
2. **Service**: Point **AWS App Runner** or **ECS** to your ECR image.
3. **Networking**: Ensure the service can reach your RDS PostgreSQL instance.

---

## 🗄️ Database Management (PostgreSQL)
### Production recommendation:
- Use a managed service like **AWS RDS** or **DigitalOcean Managed Databases**.
- **Do not** use the `db` service in `docker-compose.yml` for critical production data unless you have a robust backup strategy.

### Connection String:
Your `DATABASE_URL` should follow this format:
`postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]?sslmode=require`

---

## 🔐 Required Production Variables
| Service | Variable | Description |
|---------|----------|-------------|
| Backend | `DATABASE_URL` | PostgreSQL connection string |
| Backend | `JWT_SECRET` | Long random string for token signing |
| Backend | `FRONTEND_URL` | Domain of your frontend (for CORS) |
| Frontend| `NEXT_PUBLIC_API_URL` | Backend API URL accessible from browser |

---

## 🛠️ Maintenance & SSL
- **SSL**: Use **Cloudflare** or **Certbot (Nginx)** if deploying on a raw VPS.
- **Port**: Ensure ports `443` (HTTPS) and `80` (HTTP) are open on your server firewall.
