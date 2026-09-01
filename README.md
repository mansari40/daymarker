<div align="center">

# Daymark

### A quieter way to plan your day.

Daymark is a minimalist daily task app built around a single idea: **one clear intention, not an endless backlog.** Tasks carry a category, a weight, and a time of day instead of priority tiers and due-date pressure, and a streak/week view turns finishing your list into a small daily ritual instead of a chore.

[![Live on Vercel](https://img.shields.io/badge/LIVE_ON_VERCEL-Open_app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://daymarker.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NextAuth.js](https://img.shields.io/badge/Auth-NextAuth.js_v5-6C47FF)](https://authjs.dev/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

[**Open the live app**](https://daymarker.vercel.app) ·
[**Explore the architecture**](#architecture) ·
[**Run locally**](#run-locally) ·
[**API surface**](#api-surface)

<p>If you find Daymark useful, please consider starring the repo ⭐</p>

</div>

---

## The idea

> **Daymark is not a project-management tool.**

There are no priority levels, no nested subtasks, no boards. A task has three simple dimensions, **category**, **weight**, and **time of day** and an optional due date. The app is built to make *finishing* today's list feel good, not to help you plan next quarter.

---

## At a glance

| | |
|---|---|
| **Core loop** | Add a task → give it a category/weight/time of day → mark it done → watch your streak grow |
| **Auth** | Email + password via NextAuth.js v5 (Credentials provider), sessions as JWT |
| **Persistence** | PostgreSQL via Prisma ORM, with a Prisma adapter wired into NextAuth |
| **Task views** | Today, Upcoming, Completed, Archive |
| **Task shape** | Category (Work / Personal / Health / Errand / Other), Weight (Light / Steady / Medium Focus / Heavy), Time of day (Morning / Afternoon / Evening / Anytime), optional due date |
| **Progress tracking** | Daily completion ring, current streak, and a 7-day (Tue–Mon) activity chart |
| **Theming** | Light/dark mode, persisted in `localStorage` and applied pre-hydration to avoid flash-of-wrong-theme |
| **Route protection** | Next.js middleware guards `/desk` and the task/stats API routes for unauthenticated requests |
| **Deployment** | Vercel (app) with a Dockerfile + Docker Compose available for self-hosting |

---

## Architecture

Daymark is a single Next.js application using the App Router, there's no separate backend service. API routes under `src/app/api` handle data access directly through Prisma, and `middleware.ts` enforces auth before those routes (or the `/desk` page) ever render.

### Request flow

```mermaid
flowchart TD
    START([Browser request]) --> MW{middleware.ts}

    MW -->|"/desk or /api/tasks, /api/stats"| AUTH{Authenticated?}
    MW -->|public route| PASS[Render normally]

    AUTH -->|no| REDIRECT[Redirect to /signin<br/>or 401 JSON]
    AUTH -->|yes| ROUTE[Route Handler]

    ROUTE --> PRISMA[(Prisma Client)]
    PRISMA --> DB[(PostgreSQL)]
    DB --> PRISMA
    PRISMA --> ROUTE
    ROUTE --> RESPONSE[JSON response]
```

### Sign-in flow

```mermaid
sequenceDiagram
    autonumber

    actor User
    participant UI as Sign-in Page
    participant NA as NextAuth (Credentials)
    participant DB as PostgreSQL (via Prisma)

    User->>UI: Submit email + password
    UI->>NA: signIn("credentials", ...)
    NA->>DB: findUnique({ email })
    DB-->>NA: user record (passwordHash)
    NA->>NA: bcrypt.compare(password, passwordHash)
    alt Valid credentials
        NA-->>UI: Session established (JWT)
        UI->>User: Redirect to /desk
    else Invalid credentials
        NA-->>UI: null / error
        UI->>User: "Invalid email or password"
    end
```

---

## Data model

The core entity is `Task`, scoped to the authenticated user via `userId`. Every task/stats API route verifies ownership before reading or mutating a record.

```text
Task
├── id, userId, title
├── category:    WORK | PERSONAL | HEALTH | ERRAND | OTHER
├── weight:      LIGHT | STEADY | MEDIUM_FOCUS | HEAVY
├── timeOfDay:   MORNING | AFTERNOON | EVENING | ANYTIME
├── dueDate:     optional
├── completed, completedAt
├── archived
└── createdAt
```

Streaks and the weekly activity chart are computed in `lib/streak.ts` by grouping completed tasks by calendar day and counting backward from today.

---

## Frontend

| Area | Route | Purpose |
|---|---|---|
| **Landing** | `/` | Marketing page - hero, ritual/principles sections, closing CTA |
| **Sign in** | `/signin` | Credentials sign-in |
| **Sign up** | `/signup` | Account creation, auto-signs-in on success |
| **Desk** | `/desk` | The main app - task list, tabs (Today/Upcoming/Completed/Archive), search, add/edit modal, stats row |

UI primitives (`Button`, `Input`, `Select`, `Modal`, `Tabs`) live under `components/ui`, with feature components split into `components/landing` and `components/desk`.

---

## API surface

```text
POST   /api/auth/register        Create an account
GET    /api/auth/[...nextauth]   NextAuth session/callback handlers
POST   /api/auth/[...nextauth]

GET    /api/tasks?status=        List tasks (today | upcoming | completed | archive)
POST   /api/tasks                Create a task
PATCH  /api/tasks/[id]           Update / complete / archive a task
DELETE /api/tasks/[id]           Delete a task

GET    /api/stats                Today's progress, current streak, 7-day chart
```

All routes except registration and the NextAuth handlers require a valid session; `middleware.ts` and per-route `auth()` checks both enforce this.

---

## Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) | Routing, server + client components |
| **Language** | TypeScript | End-to-end type safety |
| **Auth** | NextAuth.js v5 (beta) + `@auth/prisma-adapter` | Credentials auth, JWT sessions |
| **Password hashing** | bcryptjs | Salting/hashing stored credentials |
| **ORM** | Prisma | Schema, migrations, typed queries |
| **Database** | PostgreSQL | Persistent storage |
| **Styling** | Tailwind CSS v4 | Design tokens via `@theme`, dark/light mode |
| **Icons** | lucide-react | Iconography |
| **Fonts** | Geist (via `next/font/google`) | Typography |
| **Containerization** | Docker + Docker Compose | Local and self-hosted deployment |
| **Hosting** | Vercel | Production deployment |

---

## Repository structure

```text
daymark/
│
├── prisma/
│   ├── schema.prisma          # Task/User models
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout, theme bootstrap
│   │   ├── (auth)/              # /signin, /signup
│   │   ├── desk/                # Main app
│   │   └── api/
│   │       ├── auth/
│   │       ├── tasks/
│   │       └── stats/
│   │
│   ├── components/
│   │   ├── ui/                  # Button, Input, Select, Modal, Tabs, ThemeToggle
│   │   ├── landing/              # Navbar, Hero, sections, Footer
│   │   ├── desk/                  # TaskList, TaskItem, StatsRow, AddTaskModal, ...
│   │   └── auth/                  # AuthCard
│   │
│   ├── lib/
│   │   ├── auth.ts               # NextAuth config + Credentials provider
│   │   ├── auth.config.ts        # Edge-safe config (used by middleware)
│   │   ├── prisma.ts             # Prisma client singleton
│   │   └── streak.ts             # Streak + weekly-activity computation
│   │
│   └── middleware.ts             # Route protection for /desk and protected APIs
│
├── Dockerfile
├── docker-compose.yml
└── docker-compose.dev.yml
```

---

## Run locally

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or the included Docker service)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/<your-github-username>/daymark.git
cd daymark
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Set at minimum:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/daymark
AUTH_SECRET=your_generated_secret
```

Generate a secret with `npx auth secret` or `openssl rand -base64 32`. Do not commit real credentials.

### 3. Install dependencies and set up the database

```bash
npm install
npx prisma migrate deploy
```

### 4. Start the dev server

```bash
npm run dev
```

### 5. Open the app

```text
http://localhost:3000
```

### Running with Docker instead

```bash
docker compose up --build
```

---

## Design notes

### Weight and category over priority

Most task apps push urgency (P0/P1/P2, red due dates). Daymark deliberately avoids that `weight` (Light/Steady/Medium Focus/Heavy) describes effort, not importance, and there's no way to mark a task "urgent." The goal is a calmer relationship with a short list, not a queue to triage.

### Streak computed server-side, not cached client state

Streaks and the weekly chart are recomputed from `completedAt` timestamps on every `/api/stats` call rather than stored as a running counter. This trades a small amount of query cost for correctness, a counter can drift if a task's completion is later toggled off; a derived value can't.

### Middleware + per-route auth checks, not just one or the other

`middleware.ts` blocks unauthenticated requests to `/desk` and the task/stats APIs before they render or execute. Each API route handler also independently calls `auth()` and checks the session so a route stays safe even if it's ever reached through a path the middleware matcher doesn't cover.

---

<div align="center">

### Built with Next.js · NextAuth.js · Prisma · PostgreSQL · Tailwind CSS

**Made to help you plan a productive day**

[Live App](https://daymarker.vercel.app) ·
[GitHub](https://github.com/<your-github-username>/daymark) ·
[Report an issue](https://github.com/<your-github-username>/daymark/issues)

</div>