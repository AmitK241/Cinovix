<div align="center">

<img src="./client/public/logo.png" alt="Cinovix" height="110" />

### Streaming that thinks with you.

**An AI-powered streaming platform that learns your taste, understands natural language search, and helps you discover what to watch next — across Bollywood, Hollywood, and regional cinema.**

<br/>

[![Live Demo](https://img.shields.io/badge/🎬_Live_Demo-cinovix.vercel.app-7C3AED?style=for-the-badge)](https://cinovix.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](#)
[![Groq](https://img.shields.io/badge/AI-Groq_LLM-EC4899?style=flat-square)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](#)

<br/>

**[🔗 Try the Live App](https://cinovix.vercel.app/)** &nbsp;|&nbsp; **[📂 View Source](https://github.com/AmitK241/Cinovix)**

</div>

---

## 📖 Overview

Cinovix is a full-stack, AI-driven streaming platform built to demonstrate production-grade engineering across the MERN stack, LLM integration, and modern frontend design. Unlike typical "Netflix clone" tutorials, Cinovix goes beyond a static content grid — it ships with a **working AI recommendation engine**, **natural language semantic search**, a **subscription billing flow**, and a **fully custom design system** built from scratch.

> **A note on content:** Cinovix uses [TMDB](https://www.themoviedb.org/) for content metadata (posters, cast, trailers, watch-provider availability) and does not stream copyrighted full-length films — real movie licensing requires studio deals that are out of scope for a project like this. Trailer playback, AI recommendations, reviews, and every other feature below are fully functional with real, live data.

<br/>

<div align="center">
<i>🎥 Add a screenshot or short screen-recording GIF of the Browse page here for maximum impact</i>
</div>

<br/>

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🎬 Core Streaming Experience
- 🔐 JWT authentication with protected routes
- 👥 Multi-profile system (up to 5 profiles, custom avatars)
- 🎬 Browse by trending, region (Bollywood, Hollywood, Tollywood, Kollywood, Mollywood, Sandalwood), or platform (Netflix, Prime Video, JioHotstar, ZEE5)
- 🔍 Debounced keyword search
- ▶️ Watch page — trailer, cast, genres, similar titles
- 📌 My List (watchlist)
- ⏱️ Continue Watching with resume
- ⭐ Ratings & reviews

</td>
<td width="50%" valign="top">

### 🤖 AI-Powered (Groq LLM)
- 🎯 **AI Recommendation Engine** — builds a taste profile from watch history and surfaces personalized picks
- 💬 **Semantic Search** — *"a sad emotional bollywood drama"* is parsed into structured filters and matched against real content

### 💼 Platform Features
- 💳 Simulated subscription billing (Basic/Standard/Premium)
- 🔔 Live notification system
- 🎨 Custom **"Aurora"** design system — violet–magenta–cyan gradients, glassmorphism, micro-interactions

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 (Vite), React Router, Tailwind CSS v4, Axios |
| **Backend** | Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt |
| **AI / LLM** | Groq API (`openai/gpt-oss-120b`) — taste analysis & query parsing |
| **External APIs** | TMDB (metadata, trailers, watch providers), YouTube (embed playback) |
| **Deployment** | Vercel (frontend) · Render (backend) |

---

## 🏗️ Architecture

```
Cinovix/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # auth, content, navigation, subscription
│   │   ├── pages/          # Route-level pages
│   │   ├── context/        # Auth & Profile providers
│   │   ├── services/       # Axios API layer
│   │   ├── hooks/          # useDebounce, etc.
│   │   └── data/
│   └── public/
│
├── server/                 # Node/Express backend
│   ├── config/              # DB connection
│   ├── models/               # Mongoose schemas
│   ├── controllers/           # Route handlers
│   ├── routes/                  # Express routers
│   ├── middleware/                # Auth middleware
│   └── services/                    # TMDB, Groq AI, subscription logic
│
└── README.md
```

**Request flow — AI Semantic Search:**

```
User types query → Search.jsx
  → POST /api/ai/search → aiController.js
    → Groq LLM parses query into { keywords, genres, language }
      → TMDB /discover filtered by parsed params
        → Results rendered as a content grid
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free tier)
- [TMDB API key](https://www.themoviedb.org/settings/api)
- [Groq API key](https://console.groq.com)

### Installation

```bash
git clone https://github.com/AmitK241/Cinovix.git
cd Cinovix
```

**Backend:**
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
TMDB_API_KEY=your_tmdb_api_key
GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

**Frontend:**
```bash
cd ../client
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` \| `/login` | Register / login |
| GET | `/api/content/trending` | Trending movies |
| GET | `/api/content/search` | Keyword search |
| GET | `/api/content/:id` | Details (trailer, cast, genres) |
| GET | `/api/content/:id/similar` | Similar titles |
| GET | `/api/content/providers` | Streaming platform list |
| POST | `/api/ai/search` | Natural language semantic search |
| GET | `/api/ai/recommendations` | AI recommendations |
| ALL | `/api/mylist` | Watchlist CRUD |
| GET/POST | `/api/watch-history` | Continue Watching |
| ALL | `/api/reviews/:tmdbId` | Ratings & reviews |
| POST | `/api/subscription/create` \| `/verify` \| `/cancel` | Subscription flow |
| ALL | `/api/notifications` | Notifications |

All routes except `/auth/*` require an `Authorization: Bearer <token>` header.

---

## 🎨 Design Philosophy

Cinovix deliberately avoids visually copying existing streaming platforms. The **"Aurora"** design language — a violet → magenta → cyan gradient system with glassmorphism panels and subtle motion — reflects that the product's core differentiator is *intelligence*, not just content browsing.

---

## 🧪 Known Limitations

- Full movie playback is intentionally out of scope — trailers demonstrate the video experience (see note above)
- Subscription payments are simulated; no real payment gateway is charged
- AI features depend on Groq API availability and free-tier rate limits

---

## 👤 Author

**Amit Kumar**
B.Tech CSE, MNNIT Allahabad
[GitHub](https://github.com/AmitK241) · [LinkedIn](https://linkedin.com/in/amit-kumar-3a602a289)

<div align="center">

<br/>

⭐ **If you found this project interesting, consider giving it a star!**

</div>
