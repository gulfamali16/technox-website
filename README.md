# TechnoX Society Website

![TechnoX](https://img.shields.io/badge/TechnoX-Society-00D4FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTUtMTAtNXpNMiAxN2wxMCA1IDEwLTV6Ii8+PC9zdmc+)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=node.js)
![Deploy Frontend](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![Deploy Backend](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render)

> **The Official Computer Science Society Website of COMSATS University Islamabad, Vehari Campus.**
> Innovate. Code. Transform.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Local Development](#local-development)
  - [Frontend](#running-the-frontend)
  - [Backend](#running-the-backend)
- [Deployment](#deployment)
  - [Frontend → Vercel](#deploying-frontend-to-vercel)
  - [Backend → Render](#deploying-backend-to-render)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Updating Content](#updating-content)
- [Features](#features)

---

## Project Overview

TechnoX Society is the premier Computer Science society at COMSATS University Islamabad, Vehari Campus. This repository contains the complete production-grade website:

- A **pure vanilla JS / HTML5 / CSS3 frontend** with no external libraries, deployed on Vercel.
- A **Node.js / Express backend API** serving events, team, and contact data, deployed on Render.

---

## Project Structure

```
technox-website/
├── frontend/
│   ├── index.html          # Single-page application
│   ├── vercel.json         # Vercel SPA routing config
│   ├── css/
│   │   └── style.css       # Complete styles (no external CSS)
│   └── js/
│       └── main.js         # All frontend logic (no external JS)
│
├── backend/
│   ├── server.js           # Express server entry point
│   ├── package.json        # Node dependencies
│   ├── render.yaml         # Render deployment config
│   ├── routes/
│   │   ├── events.js       # GET /api/events, GET /api/events/:id
│   │   ├── team.js         # GET /api/team
│   │   └── contact.js      # POST /api/contact
│   └── data/
│       ├── events.json     # Event data (edit to update events)
│       └── team.json       # Team member data (edit to update team)
│
└── README.md
```

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript   |
| Backend  | Node.js, Express.js               |
| Rate Limiting | express-rate-limit            |
| CORS     | cors npm package                  |
| Hosting  | Vercel (frontend), Render (backend) |
| Data     | JSON flat files                   |

---

## Local Development

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- A modern browser (Chrome, Firefox, Edge, Safari)

---

### Running the Frontend

The frontend is pure static HTML/CSS/JS — no build step required.

**Option A – VS Code Live Server**

1. Open `frontend/` in VS Code.
2. Right-click `index.html` → **Open with Live Server**.

**Option B – Python HTTP server**

```bash
cd frontend
python3 -m http.server 3000
# Open http://localhost:3000
```

**Option C – Node serve**

```bash
npx serve frontend -p 3000
# Open http://localhost:3000
```

> When running locally without the backend, the website uses built-in fallback data for events and team — no backend required for the UI to work.

---

### Running the Backend

```bash
cd backend
npm install
npm run dev       # uses nodemon for hot-reload
# Server starts at http://localhost:5000
```

To verify it's running:

```bash
curl http://localhost:5000/api/health
# {"success":true,"status":"ok","timestamp":"..."}
```

**Connecting frontend to local backend:**

In `frontend/js/main.js`, the `BACKEND_URL` constant is `''` (same origin). When serving the frontend separately from the backend, update it temporarily for local testing:

```js
// frontend/js/main.js – line ~15
const BACKEND_URL = 'http://localhost:5000';
```

---

## Deployment

### Deploying Frontend to Vercel

1. **Push to GitHub** — ensure the `frontend/` folder is in your repository.

2. **Create a Vercel account** at [vercel.com](https://vercel.com) (free tier is fine).

3. **Import your repository:**
   - Click **Add New → Project**
   - Select your GitHub repository
   - Set **Root Directory** to `frontend`
   - Framework Preset: **Other** (static)
   - Click **Deploy**

4. **SPA routing** is handled automatically by `frontend/vercel.json`.

5. **Set the backend URL** (after deploying backend):
   - Go to Vercel project → **Settings → Environment Variables**
   - Add `BACKEND_URL` = `https://your-backend.onrender.com`
   - **Or** update `BACKEND_URL` directly in `frontend/js/main.js` before deploying.

6. Vercel will give you a URL like `https://technox.vercel.app`.

---

### Deploying Backend to Render

1. **Push to GitHub** — ensure the `backend/` folder is in your repository.

2. **Create a Render account** at [render.com](https://render.com) (free tier available).

3. **Create a new Web Service:**
   - Click **New → Web Service**
   - Connect your GitHub repository
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
   - **Plan:** Free

   > Alternatively, Render will auto-detect `backend/render.yaml` if you use **Blueprint** deployment.

4. **Environment Variables** (optional, for production):
   - `NODE_ENV` = `production`
   - `ALLOWED_ORIGIN` = `https://your-frontend.vercel.app` (restrict CORS)

5. Render will give you a URL like `https://technox-backend.onrender.com`.

6. **Update frontend** — paste the Render URL into `BACKEND_URL` in `frontend/js/main.js`.

> **Note:** Render free-tier services spin down after inactivity. The first request after sleep may take ~30 seconds. The frontend handles this gracefully with fallback data.

---

## Environment Variables

### Backend (`backend/`)

| Variable         | Default | Description                                    |
|------------------|---------|------------------------------------------------|
| `PORT`           | `5000`  | Port the Express server listens on             |
| `NODE_ENV`       | –       | Set to `production` on Render                  |
| `ALLOWED_ORIGIN` | `*`     | CORS allowed origin (set to your Vercel URL)   |

### Frontend (`frontend/js/main.js`)

| Constant       | Default | Description                                      |
|----------------|---------|--------------------------------------------------|
| `BACKEND_URL`  | `''`    | Base URL of the backend API. Set to your Render URL in production. |

---

## API Documentation

Base URL: `http://localhost:5000` (local) or `https://technox-backend.onrender.com` (production)

### Health Check

```
GET /api/health
```

Response:
```json
{ "success": true, "status": "ok", "timestamp": "2025-01-01T00:00:00.000Z" }
```

---

### Events

#### Get All Events

```
GET /api/events
GET /api/events?type=workshop
GET /api/events?type=seminar
GET /api/events?type=competition
```

Response:
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "id": 1,
      "title": "Web Development Workshop",
      "date": "2025-03-15",
      "description": "...",
      "type": "workshop",
      "status": "upcoming",
      "registrationLink": "#"
    }
  ]
}
```

#### Get Single Event

```
GET /api/events/:id
```

Response: `{ "success": true, "data": { ...event } }`
Error (404): `{ "success": false, "message": "Event not found." }`

---

### Team

#### Get All Team Members

```
GET /api/team
```

Response:
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "id": 1,
      "fullName": "Dr. Umar Rashid",
      "role": "Faculty Advisor",
      "bio": "...",
      "avatar": "https://...",
      "social": { "email": "drumarrashidcui@gmail.com" }
    }
  ]
}
```

---

### Contact

#### Submit Contact Form

```
POST /api/contact
Content-Type: application/json
```

Request body:
```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "subject": "Optional subject",
  "message": "Your message (min 10 chars)"
}
```

Success response (200):
```json
{ "success": true, "message": "Thank you for reaching out! We'll get back to you soon." }
```

Validation error (400):
```json
{ "success": false, "errors": ["Name is required.", "A valid email address is required."] }
```

Rate limit (429): Max 5 requests per 15 minutes per IP.

---

## Updating Content

### Add / Edit Events

Edit `backend/data/events.json`. Each event object:

```json
{
  "id": 8,
  "title": "Your Event Title",
  "date": "YYYY-MM-DD",
  "description": "Short description.",
  "type": "workshop",        // "workshop" | "seminar" | "competition"
  "status": "upcoming",      // "upcoming" | "past"
  "registrationLink": "https://forms.google.com/..."
}
```

Increment `id` for each new event. Restart the backend server after saving.

---

### Add / Edit Team Members

Edit `backend/data/team.json`. Each member:

```json
{
  "id": 8,
  "name": "Display Name",
  "fullName": "Full Name",
  "role": "Role Title",
  "bio": "Short bio (2-3 sentences).",
  "avatar": "https://link-to-avatar-image.jpg",
  "social": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "email": "optional@email.com"
  }
}
```

---

## Features

- ✅ **No external libraries** — pure HTML5, CSS3, Vanilla JS
- ✅ **Animated particle canvas** background in hero
- ✅ **Typing animation** with multiple phrases
- ✅ **Glassmorphism** card design system
- ✅ **Flip cards** for team members (CSS 3D transform)
- ✅ **Scroll-reveal** animations via Intersection Observer
- ✅ **Counter animations** counting up on scroll
- ✅ **Parallax** hero scrolling
- ✅ **Custom cursor** with glow effect
- ✅ **Event filter tabs** (All / Workshops / Seminars / Competitions)
- ✅ **Dynamic data** from Express API with static fallback
- ✅ **Contact form** with client + server validation
- ✅ **Rate limiting** on contact endpoint (5 req / 15 min)
- ✅ **ARIA labels** and semantic HTML5 throughout
- ✅ **Mobile responsive** (768px, 1024px breakpoints)
- ✅ **Custom scrollbar**, smooth scroll, back-to-top button
- ✅ **SEO meta tags** — Open Graph + Twitter Cards

---

## License

MIT © TechnoX Society, COMSATS University Islamabad, Vehari Campus

---

*Made with ❤️ by TechnoX Society*
