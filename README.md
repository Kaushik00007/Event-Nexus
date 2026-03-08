# EventNexus — College Event Aggregator

A full-stack web platform that aggregates, displays, and manages college tech events, hackathons, workshops, courses, and free developer resources — all in one place.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Database Schema](#4-database-schema)
5. [Backend — How It Works](#5-backend--how-it-works)
   - [API Routes](#api-routes)
   - [Authentication & Authorization](#authentication--authorization)
   - [Event Scraper System](#event-scraper-system)
   - [Automated Cleanup](#automated-cleanup)
6. [Frontend — How It Works](#6-frontend--how-it-works)
   - [Pages & Routing](#pages--routing)
   - [State Management & Contexts](#state-management--contexts)
   - [Key Components](#key-components)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [Admin Panel](#8-admin-panel)
9. [Environment Variables](#9-environment-variables)
10. [Local Development Setup](#10-local-development-setup)
11. [Deployment](#11-deployment)
12. [Folder Structure](#12-folder-structure)

---

## 1. Project Overview

EventNexus solves the problem of event discovery for college students. Events are sourced in two ways:

- **Scraped automatically** from external platforms (GDG, Devfolio, MLH, Meetup, Eventbrite) using the Firecrawl AI scraping service.
- **Submitted manually** by registered student organisers, which then go through an admin approval workflow.

Beyond events, the platform also manages:

- **Free online courses** with coupon codes (Udemy, Coursera, etc.)
- **Free developer resources** (GitHub Student Pack, cloud credits, fellowships, etc.)
- **College profiles** with their own event pages

---

## 2. Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL via **Supabase** |
| ORM / Query | Supabase JS client (`@supabase/supabase-js`) |
| Authentication | JWT (`jsonwebtoken`) + `bcryptjs` for password hashing |
| Validation | `express-validator` |
| Scheduled Jobs | `node-cron` |
| Web Scraping | **Firecrawl** (`@mendable/firecrawl-js`) |
| CORS | `cors` |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| Animations | Framer Motion (`motion`) + Lenis (smooth scroll) |
| 3D / Canvas | OGL |
| Icons | Lucide React |
| Build Tool | Vite 7 |

### Infrastructure
| Concern | Service |
|---|---|
| Database & Auth | Supabase (PostgreSQL) |
| Backend Hosting | Railway |
| Frontend Hosting | Vercel |
| AI Scraping API | Firecrawl |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────┐
│                   BROWSER                        │
│          React SPA  (Vercel)                     │
│   Vite · React Router · Tailwind · Axios         │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS / REST API
                   ▼
┌─────────────────────────────────────────────────┐
│               EXPRESS API  (Railway)             │
│  /api/auth  /api/events  /api/courses            │
│  /api/resources  /api/colleges  /api/notifs      │
│                                                  │
│  JWT Middleware → Controllers → Supabase Models  │
│                                                  │
│  node-cron → Scraper → Firecrawl → Supabase      │
└──────────────────┬──────────────────────────────┘
                   │ Supabase JS client
                   ▼
┌─────────────────────────────────────────────────┐
│           SUPABASE  (PostgreSQL)                 │
│  users · events · favorites · notifications      │
│  courses · resources · colleges                  │
└─────────────────────────────────────────────────┘
```

The frontend and backend are **completely decoupled**. The React app communicates exclusively through the REST API using a `VITE_API_URL` environment variable.

---

## 4. Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | Auto-generated |
| name | VARCHAR | |
| email | VARCHAR (UNIQUE) | |
| password | VARCHAR | bcrypt hashed |
| role | VARCHAR | `user` / `organizer` / `admin` |
| college | VARCHAR | |
| phone, avatar, bio | TEXT | Optional profile fields |

### `events`
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| title, description | TEXT | |
| category | VARCHAR | hackathon, workshop, seminar, etc. |
| event_type | VARCHAR | online / offline / hybrid |
| date, end_date | TIMESTAMP | |
| venue, city, college | TEXT | |
| organizer_id | UUID (FK → users) | NULL for scraped events |
| status | VARCHAR | pending → approved / rejected |
| tags, requirements | TEXT[] | PostgreSQL arrays |
| registration_fee | DECIMAL | 0 = free |
| featured | BOOLEAN | Pinned in homepage |
| views | INTEGER | |

> **Scraped events** are identified by having `organizer_id = NULL`.  
> **Student-submitted events** start with `status = 'pending'` and need admin approval.

### `favorites`
Many-to-many join table between `users` and `events`.

### `notifications`
Per-user notification feed. Types: `info`, `success`, `warning`, `error`.

Indexes are created on `status`, `date`, `category`, `city`, and `organizer_id` for fast filtering. Full-text GIN indexes exist on `title` and `description`.

---

## 5. Backend — How It Works

### API Routes

| Prefix | File | Description |
|---|---|---|
| `/api/auth` | `authRoutes.js` | Register, login, get me, update profile |
| `/api/events` | `eventRoutes.js` | CRUD events, favorites, status management |
| `/api/courses` | `courseRoutes.js` | Free course listings with coupons |
| `/api/resources` | `resourceRoutes.js` | Free developer resources |
| `/api/colleges` | `collegeRoutes.js` | College profiles |
| `/api/notifications` | `notificationRoutes.js` | Per-user notification feed |
| `/api/health` | `server.js` | Health check endpoint |

### Authentication & Authorization

1. **Register** — POST `/api/auth/register` — hashes password with `bcryptjs`, stores in Supabase, returns JWT.
2. **Login** — POST `/api/auth/login` — verifies password hash, returns JWT (expires in 30 days).
3. **Protected routes** use the `protect` middleware which extracts the Bearer token, verifies it with `jsonwebtoken`, and attaches `req.user`.
4. **Role-based routes** use `authorize('admin')` middleware — returns 403 if the user's role doesn't match.
5. **Optional auth** — some public routes (e.g., event listing) use `optionalAuth` so that favorited state can be included when logged in, but the route still works for guests.

```
POST /api/auth/register  →  { name, email, password, college }  →  { token }
POST /api/auth/login     →  { email, password }                 →  { token }
GET  /api/auth/me        →  Bearer <token>                      →  { user }
```

### Event Scraper System

Located in `backend/scraper/`. The scraper runs on a schedule using `node-cron` and uses **Firecrawl** to parse JavaScript-rendered pages.

**Configured sources** (`source.config.js`):
- GDG Bangalore, GDG Cloud Bangalore, GDG Mangalore
- Devfolio Karnataka (hackathons)
- Meetup Bangalore Tech
- MLH Events (2026 season)
- Eventbrite (tech events in Bangalore)

**Process (two-step scraping)**:
```
1. Firecrawl fetches the listing page  →  extracts individual event URLs
2. For each valid URL → Firecrawl fetches the event detail page
3. Custom parser function extracts structured data (title, date, location, etc.)
4. Deduplication check against existing DB records
5. Inserts new events with status = 'approved' and organizer_id = NULL
```

Run manually:
```bash
npm run scrape:events   # run event scraper
npm run scrape:courses  # run course scraper
```

### Automated Cleanup

`utils/eventCleanup.js` registers a `node-cron` job that runs nightly to mark past events as `completed` and clean up stale data, keeping the event list fresh.

---

## 6. Frontend — How It Works

### Pages & Routing

| Route | Page | Access |
|---|---|---|
| `/` | `Home.jsx` | Public |
| `/events` | `Events.jsx` | Public |
| `/events/:id` | `EventDetail.jsx` | Public |
| `/hackathons` | `Hackathons.jsx` | Public |
| `/competitions` | `Competitions.jsx` | Public |
| `/courses` | `Courses.jsx` | Public |
| `/free-resources` | `FreeResources.jsx` | Public |
| `/colleges/:id/events` | `CollegeEvents.jsx` | Public |
| `/login` | `Login.jsx` | Public |
| `/register` | `Register.jsx` | Public |
| `/dashboard` | `Dashboard.jsx` | **Private** |
| `/create-event` | `CreateEvent.jsx` | **Private** |
| `/favorites` | `Favorites.jsx` | **Private** |
| `/profile` | `Profile.jsx` | **Private** |
| `/notifications` | `Notifications.jsx` | **Private** |
| `/admin` | `Admin.jsx` | **Private (admin only)** |

Private routes are wrapped in `PrivateRoute.jsx` which checks `AuthContext` and redirects to `/login` if unauthenticated.

### State Management & Contexts

The app uses React Context API — no Redux.

| Context | File | Purpose |
|---|---|---|
| `AuthContext` | `AuthContext.jsx` | Current user, login/logout, token storage |
| `EventContext` | `EventContext.jsx` | Current event, fetch event, toggle favorite |
| `ThemeContext` | `ThemeContext.jsx` | Dark/light mode, persisted in `localStorage` |
| `ToastContext` | `ToastContext.jsx` | Global `toast.success()` / `toast.error()` notifications |

### Key Components

| Component | Description |
|---|---|
| `Navbar` | Top navigation with auth state, theme toggle |
| `Sidebar` | Collapsible left sidebar with page links |
| `EventCard` | Reusable event card with image, date, tags, favorite button |
| `EventFilters` | Filter bar — category, date, city, event type, search |
| `FeaturedSection` | Horizontal scroll of featured/pinned events |
| `LocalEventsSection` | Events filtered by user's detected/selected city |
| `BackgroundParticles` | Animated OGL canvas background effect |
| `LightRays` | Animated light beam decorative component |
| `ScrollVelocity` | Text marquee component that reacts to scroll speed |
| `ThemeToggle` | Dark/light mode switch button |
| `LoadingSpinner` | Reusable spinner |
| `EventCardSkeleton` | Skeleton loader while events are fetching |

---

## 7. User Roles & Permissions

| Action | Guest | User | Organizer | Admin |
|---|---|---|---|---|
| Browse events | ✅ | ✅ | ✅ | ✅ |
| View event detail | ✅ | ✅ | ✅ | ✅ |
| Favorite events | ❌ | ✅ | ✅ | ✅ |
| Submit new event | ❌ | ✅ | ✅ | ✅ |
| Edit own event | ❌ | ✅ | ✅ | ✅ |
| Approve / reject events | ❌ | ❌ | ❌ | ✅ |
| Edit any event | ❌ | ❌ | ❌ | ✅ |
| Delete scraped events | ❌ | ❌ | ❌ | ✅ |
| Mark event featured | ❌ | ❌ | ❌ | ✅ |
| Manage courses | ❌ | ❌ | ❌ | ✅ |
| Manage resources | ❌ | ❌ | ❌ | ✅ |
| Manage colleges | ❌ | ❌ | ❌ | ✅ |

---

## 8. Admin Panel

The `/admin` page is a full management dashboard, accessible only to users with `role = 'admin'`.

### Events Tab
- **Pending Approval** sub-tab — lists all student-submitted events awaiting review. Admin can: Approve, Reject (with reason sent as notification), Edit, or Feature each event.
- **Scraped Events** sub-tab — lists all auto-scraped events. Admin can: Edit, Feature, or Delete them.

### Courses Tab
Full CRUD for free online courses — create, edit, delete, toggle active/inactive status, copy coupon codes.

### Resources Tab
Full CRUD for free developer resources — GitHub packs, cloud credits, fellowships, tools, etc.

### Colleges Tab
Full CRUD for college profiles used for `CollegeEvents` pages and event tagging.

---

## 9. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d

# Admin registration secret
ADMIN_SECRET_KEY=your-admin-secret

# Firecrawl (for scraping)
FIRECRAWL_API_KEY=your-firecrawl-key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 10. Local Development Setup

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- (Optional) Firecrawl API key for scraping

### Step 1 — Clone and install dependencies
```bash
git clone https://github.com/Kaushik00007/Event-Nexus.git
cd Event-Nexus

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2 — Set up the database
1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** in the Supabase dashboard
3. Paste and run the contents of `backend/database/schema.sql`

### Step 3 — Configure environment variables
Create `backend/.env` and `frontend/.env` using the templates in [Section 9](#9-environment-variables).

### Step 4 — (Optional) Seed the database
```bash
cd backend
npm run seed
```

### Step 5 — Start the servers
```bash
# Terminal 1 — backend
cd backend
npm run dev     # runs on http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm run dev     # runs on http://localhost:5173
```

### Step 6 — (Optional) Run the scrapers manually
```bash
cd backend
npm run scrape:events    # scrape events from GDG, Devfolio, MLH, etc.
npm run scrape:courses   # scrape free courses
```

---

## 11. Deployment

| Part | Platform | Config file |
|---|---|---|
| Backend | Railway | `backend/railway.json` |
| Frontend | Vercel | `frontend/vercel.json` |
| Database | Supabase | Cloud-hosted PostgreSQL |

### Frontend (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Set environment variable: `VITE_API_URL=https://your-railway-backend.up.railway.app/api`
- `vercel.json` rewrites all routes to `index.html` for SPA routing.

### Backend (Railway)
- Start command: `npm start`
- Set all environment variables from Section 9 in the Railway dashboard.

---

## 12. Folder Structure

```
EventNexus/
├── backend/
│   ├── server.js                  # Express app entry point
│   ├── config/
│   │   └── db.js                  # Supabase connection
│   ├── controllers/               # Route handler logic
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── courseController.js
│   │   ├── resourceController.js
│   │   ├── collegeController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT protect / authorize / optionalAuth
│   │   └── errorHandler.js
│   ├── models/supabase/           # Supabase query wrappers (like lightweight models)
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Course.js
│   │   ├── Resource.js
│   │   ├── College.js
│   │   └── Notification.js
│   ├── routes/                    # Express routers
│   ├── scraper/
│   │   ├── source.config.js       # Scraper source definitions + parsers
│   │   ├── scraper.service.js     # Core Firecrawl scraping logic
│   │   ├── course.scraper.service.js
│   │   ├── run-event-scraper.js   # Entry: npm run scrape:events
│   │   └── run-course-scraper.js  # Entry: npm run scrape:courses
│   ├── utils/
│   │   ├── eventCleanup.js        # Cron job — mark past events completed
│   │   └── seeder.supabase.js     # DB seed script
│   └── database/
│       └── schema.sql             # Full PostgreSQL schema
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                # Root component, routes
        ├── main.jsx               # ReactDOM entry
        ├── index.css              # Global styles + Tailwind directives
        ├── components/
        │   ├── auth/PrivateRoute.jsx
        │   ├── common/            # Spinner, Skeleton, ThemeToggle, etc.
        │   ├── events/            # EventCard, EventFilters, Featured/Local sections
        │   ├── colleges/          # CollegeSection
        │   └── layout/            # Navbar, Sidebar, Footer
        ├── context/               # AuthContext, EventContext, ThemeContext, ToastContext
        ├── hooks/useLenis.js      # Lenis smooth scroll initialisation
        ├── pages/                 # One file per page/route
        ├── services/              # Axios API call wrappers (one per resource)
        └── utils/
            ├── constants.js
            └── helpers.js         # Date formatting, category colours, etc.
```
