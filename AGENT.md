# AGENT.md — Build "Daymark" (personal daily-intentions app)

You are an autonomous coding agent. Your job is to build a full-stack web app called
**Daymark** from scratch, matching the exact visual design described below, with working
email/password authentication and full task CRUD (create, list, complete, edit, delete).
The app must run fully locally via Docker.

Work through this file top to bottom. Do not skip the design tokens section — visual
fidelity is a hard requirement, not a nice-to-have.

---

## 0. Product summary

Daymark is a minimalist daily task/intentions app.

- **Marketing/landing page** — hero, "how it works" section, footer CTA.
- **Auth** — sign up / sign in, split-screen layout (copy left, form card right).
- **Personal desk (dashboard)** — greeting, a single task list called "The next right
  things", tabs (Today / Upcoming / Completed / Archive), search, an "Add a task" modal,
  and a stats footer (today's completion ring, weekly streak bar chart).

Tone: quiet, calm, "no noise" productivity tool. Copy is short, warm, lowercase-ish,
never shouty.

---

## 1. Tech stack (use exactly this unless a constraint below forces a substitution)

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + CSS variables for theme tokens (see §2)
- **Auth**: Auth.js (NextAuth) v5, Credentials provider, password hashed with bcrypt,
  JWT session strategy. Keep it simple — no OAuth providers needed.
- **DB**: PostgreSQL
- **ORM**: Prisma
- **Icons**: lucide-react (closest free match to the thin-line icons in the screenshots —
  flag, clock, sparkles, checkmark, calendar, sun/moon toggle, search)
- **Fonts**: see §2.2
- **Containerization**: Docker + docker-compose (app container + postgres container)

Do not introduce a UI kit (no shadcn, no MUI). Build components by hand with Tailwind so
the visual spec below can be followed precisely.

---

## 2. Design system

### 2.1 Color tokens

Set these as CSS variables in `globals.css` and mirror them in `tailwind.config.ts`
under `theme.extend.colors`. These are close-match estimates from the screenshots, not
pixel-sampled values — after first run, compare side-by-side with the reference images
and nudge lightness/saturation by eye if anything looks off.

```css
:root {
  /* backgrounds */
  --bg-base: #0a1310;        /* page background, near-black deep green */
  --bg-panel: #0e1a16;       /* cards, modals, nav bar */
  --bg-panel-hover: #142620;
  --bg-input: #0c1815;

  /* borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.14);
  --border-accent: #34d399; /* focused input ring, e.g. task-name input */

  /* text */
  --text-primary: #f4f5f1;   /* headlines, primary body */
  --text-secondary: #9aa79f; /* subtext, muted labels */
  --text-tertiary: #6b7871;  /* placeholders, faint meta */

  /* accent green (brand) */
  --accent-500: #22c55e;
  --accent-400: #4ade80;
  --accent-300: #86efac;
  --accent-muted: rgba(74, 222, 128, 0.12); /* pill backgrounds, badges */

  /* button on dark (primary CTA is an off-white pill, not green) */
  --btn-primary-bg: #f4f5f1;
  --btn-primary-text: #0a1310;
  --btn-secondary-bg: transparent;
  --btn-secondary-border: var(--border-strong);

  /* semantic */
  --success: #34d399;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-pill: 999px;
}
```

Light mode: the sun/moon icon in the top-right nav toggles theme. Implement a light
variant (swap `--bg-base` → `#f6f7f2`, `--text-primary` → `#0a1310`, etc.) but dark is
the default and primary target — match the screenshots first, light mode second.

### 2.2 Typography

The headlines use a bold, tight-tracking geometric/grotesk sans-serif (large weight
contrast between the huge bold display text and the small uppercase tracked-out labels).
Closest free, self-hostable matches, in order of preference:

1. **Geist Sans** (Vercel, open source, `npm i geist` or Google Fonts) — best match for
   the display weight and letterforms.
2. Fallback: **Inter** (variable font) at weight 700–800 for headings, 400–500 for body.

Load via `next/font` (do not use a `<link>` tag / CDN — self-host for perf and offline
dev).

Type scale (Tailwind `fontSize` extensions):

```
text-display: 56px / 1.05 / font-weight 700 / tracking -0.02em   (hero "Make a mark of today.")
text-h1:      36px / 1.1  / 700 / -0.02em                        (section headings)
text-h2:      24px / 1.2  / 700
text-body:    16px / 1.6  / 400   -- var(--text-secondary) for supporting copy
text-small:   14px / 1.5  / 500
text-label:   11px / 1.4  / 600 / uppercase / letter-spacing 0.08em / var(--accent-400)
             (eyebrow labels like "THE SMALL RITUAL", "YOUR LIST", "TODAY'S MARK")
```

### 2.3 Spacing, radius, shadows

- Base spacing unit: 4px. Section vertical padding: 96–120px on desktop.
- Cards / modals: `--radius-lg` (20px), 1px `--border-subtle` border, `--bg-panel`
  background, subtle inner shadow only — no heavy drop shadows (this design is flat and
  low-contrast).
- Buttons: pill-shaped (`--radius-pill`). Primary = solid off-white bg + dark text.
  Secondary = transparent bg + subtle border + light text. Both ~44px tall, 20px
  horizontal padding, small arrow icon (→) trailing on primary CTAs.
- Input fields: `--radius-md`, `--bg-input` background, `--border-subtle` border,
  `--border-accent` glow/ring on focus (see the green-ringed "Task" input in the Add Task
  modal screenshot).

### 2.4 Logo / brand mark

Small rounded-square badge, `--accent-500` background, white checkmark icon, 24–28px,
next to wordmark "daymark" (lowercase, medium weight).

---

## 3. Pages & components (map 1:1 to the reference screenshots)

### 3.1 Landing page (`/`)
- **Nav bar**: logo+wordmark left; center links "The ritual", "Principles"; right: a
  small circular icon button (sparkle/theme), "Sign in" text link, "Begin today" primary
  pill button.
- **Hero**: small pill eyebrow badge "● A QUIETER WAY TO PLAN", huge two-line display
  headline ("Make a mark" / "of today." — second line in accent green), supporting
  paragraph, two CTAs ("Start your ritual →" primary, "I already have a mark" text link).
  Right side: a floating card mockup preview of the task list UI (small nested card,
  slightly rotated/offset, showing a mini version of the dashboard — decorative only,
  can be a simplified static component).
- **"Less list. More day." section**: eyebrow label "THE SMALL RITUAL", h1, supporting
  paragraph on the right (2-column layout), full-width horizontal divider above/below.
- **"A few good defaults." section**: eyebrow "BUILT FOR ATTENTION", h1 left / small
  right-aligned note "Thoughtful by design / quiet by nature". Below: 3-column feature
  row, each with a number label (01/02/03), a small line-icon top-right of its column, a
  horizontal rule above, bold subheading, and one-line muted description. (flag icon /
  clock icon / sparkles icon)
- **Closing CTA section**: eyebrow "YOUR NEXT GOOD DAY", large h1 "Start with one clear
  mark.", right-aligned supporting line + "Create your day →" link.
- **Footer**: logo mini-mark + wordmark left, "Made for the next right thing." right,
  small dot icon.

### 3.2 Auth page (`/signup`, `/signin`)
Two-column split screen, no shared nav content except a minimal top bar (logo left, theme
toggle + "Back" link right).
- **Left**: eyebrow "DAYMARK / BEGIN HERE", big two-line headline ("Make today" /
  "count." — second line accent green), one-line supporting copy, a small checklist item
  row ("✓ No noise. Just your next right thing.").
- **Right**: floating card, `--bg-panel`, rounded-lg, padded ~32px: "Create your space"
  heading + "It takes less than a minute." subtext, then labeled inputs (uppercase small
  label above each): YOUR NAME, EMAIL, PASSWORD (with a show/hide eye icon toggle), full
  width primary pill button "Create my day →", small centered link "Already have a
  space? Sign in" below.
- Sign-in variant is the same card shape with fewer fields (email + password) and
  headline copy adjusted accordingly — mirror the pattern, don't reinvent it.

### 3.3 Personal desk / dashboard (`/desk`)
- **Top meta row**: small breadcrumb-style label "DAYMARK / PERSONAL DESK" top-left,
  circular theme-toggle icon button top-right.
- **Greeting header**: small dated eyebrow ("MONDAY, AUGUST 31" — real current date,
  uppercase, accent green), large greeting h1 that's time-of-day aware ("Good morning /
  afternoon / evening, {firstName}."), muted subtext "What would make today feel
  complete?", right-aligned primary pill button "+ Add a task" opening the modal (§3.4).
- **List panel header**: eyebrow "YOUR LIST", h1 "The next right things.", right-aligned
  search input ("🔍 Find a task") and a small sort toggle button (up/down chevrons in a
  square).
- **Tabs**: Today (with live count badge), Upcoming, Completed, Archive — underline
  style, active tab in white with accent-green underline, inactive muted.
- **Empty state** (when Today has 0 tasks): dashed-border rounded panel, centered ring
  icon, bold "A clean page.", muted line "Put one clear intention here, then let the rest
  of the day follow.", "+ Add your first task" pill button.
- **Task list item** (populated state): rounded card row, left circular checkbox
  (unchecked = outlined ring; checked = filled accent-green circle with white check +
  strikethrough on the task title + title dims to muted), task title bold, meta row below
  in small muted text with a colored dot: "{Weight} · {Category} · {TimeOfDay} ·
  {Date}" (e.g. "● Medium Focus · Other · Morning · Aug 31"), "···" overflow menu button
  right-aligned (edit / delete / move actions).
- **Stats footer row** (3 cards, always visible):
  1. "TODAY'S MARK" label, big "{done} of {total} finished" line, small dynamic muted
     caption ("Your day is open. Add a small intention." / "1 thing still asking for
     you." / "You made it through your list."), bottom-left "Keep the thread" micro-copy.
  2. Circular progress ring (SVG, accent green stroke, track in dark muted green),
     percentage number centered, caption below ("Start your streak today" / "1 day in a
     row").
  3. "THIS WEEK" card with a small activity/pulse icon top-right, a 7-column mini bar
     chart (Tu We Th Fr Sa Su Mo, current day highlighted/filled in accent green, others
     empty ticks), divider, flame icon + "{n} day streak" / "Your week starts here" text.
- **Bottom banner strip**: small calendar icon + "A day is made of small marks." left,
  "Keep it kind. Keep it moving." right — thin full-width bar, subtle top border.

### 3.4 "Add a task" modal ("New Mark")
Centered modal over a dimmed/blurred backdrop of the dashboard.
- Header: small green eyebrow "NEW MARK", bold h2 "What matters today?", small × close
  button top-right.
- **TASK** label + text input, placeholder "Name the next right thing", accent-green
  focus ring (this is the one field shown actively focused in the reference).
- **CATEGORY** label + select dropdown (options: e.g. Work, Personal, Health, Errand,
  Other).
- Two-column row: **WEIGHT** select (Light / Steady / Medium Focus / Heavy — reference
  shows "Steady" and elsewhere "Medium Focus", pick a consistent 4-value enum) and
  **TIME OF DAY** select (Morning / Afternoon / Evening / Anytime).
- **DATE** label (with "optional" muted suffix) + date input with calendar icon,
  defaulting to today.
- Footer buttons: "Not now" (secondary, closes modal) and "Add to today" (primary pill,
  submits).

---

## 4. Data model (Prisma schema)

```prisma
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  tasks        Task[]
}

enum Category {
  WORK
  PERSONAL
  HEALTH
  ERRAND
  OTHER
}

enum Weight {
  LIGHT
  STEADY
  MEDIUM_FOCUS
  HEAVY
}

enum TimeOfDay {
  MORNING
  AFTERNOON
  EVENING
  ANYTIME
}

model Task {
  id          String     @id @default(cuid())
  title       String
  category    Category   @default(OTHER)
  weight      Weight     @default(STEADY)
  timeOfDay   TimeOfDay  @default(ANYTIME)
  dueDate     DateTime?
  completed   Boolean    @default(false)
  completedAt DateTime?
  archived    Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Streak logic: a "streak day" = at least one task completed that day. Compute the current
streak and this-week bar chart server-side from `completedAt` timestamps, grouped by day
in the user's local week (assume week starts Tuesday per the screenshot ordering — Tu We
Th Fr Sa Su Mo — but make this a simple derived array, don't hardcode Tuesday elsewhere).

---

## 5. API surface (Next.js Route Handlers under `app/api`)

- `POST /api/auth/register` — create user (hash password with bcrypt, min 8 chars)
- Auth.js handles `/api/auth/[...nextauth]` for sign in/out/session
- `GET /api/tasks?status=today|upcoming|completed|archive` — list tasks for session user
- `POST /api/tasks` — create task
- `PATCH /api/tasks/:id` — update (toggle complete, edit fields, archive)
- `DELETE /api/tasks/:id` — delete
- `GET /api/stats` — returns `{ todayDone, todayTotal, streak, week: [{day, done}] }`

All routes must check the session and scope queries to `userId` — never trust a client-
supplied user id.

---

## 6. Folder structure

```
daymark/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── page.tsx              # landing
│   │   ├── (auth)/signup/page.tsx
│   │   ├── (auth)/signin/page.tsx
│   │   ├── desk/page.tsx         # dashboard (protected)
│   │   ├── api/...
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── landing/...
│   │   ├── auth/AuthCard.tsx
│   │   ├── desk/{Greeting,TaskList,TaskItem,AddTaskModal,StatsRow,ProgressRing,WeekChart}.tsx
│   │   └── ui/{Button,Input,Select,Modal,Tabs}.tsx
│   ├── lib/{auth.ts,prisma.ts,streak.ts}
│   └── fonts/                    # self-hosted Geist/Inter files
```

---

## 7. Docker setup

**`docker-compose.yml`**
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: daymark
      POSTGRES_PASSWORD: daymark
      POSTGRES_DB: daymark
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    restart: unless-stopped
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://daymark:daymark@db:5432/daymark
      NEXTAUTH_SECRET: change-me-in-prod
      NEXTAUTH_URL: http://localhost:3000
    ports:
      - "3000:3000"
    command: sh -c "npx prisma migrate deploy && npm run start"

volumes:
  db_data:
```

**`Dockerfile`** (multi-stage, production build)
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
```

For local dev with hot reload instead, add a `docker-compose.dev.yml` that mounts the
source as a volume and runs `npm run dev` — build the production setup first, dev
override second, so `docker compose up` always produces a working deployable image.

---

## 8. Build order (do these in sequence, commit after each)

1. Scaffold Next.js + TS + Tailwind, set up fonts and CSS variable tokens from §2.
2. Build the shared `ui/` primitives (Button, Input, Select, Modal, Tabs) using the
   tokens — get these pixel-close before building pages, everything else reuses them.
3. Build the landing page (§3.1) — static, no data.
4. Set up Prisma schema + `docker compose up db`, run first migration.
5. Implement Auth.js Credentials provider + register endpoint; build signup/signin pages
   (§3.2).
6. Add route protection (middleware redirecting unauthenticated users away from `/desk`).
7. Build the dashboard shell + empty state (§3.3) wired to real (empty) task data.
8. Build the Add Task modal (§3.4) + create endpoint; verify a task appears in Today.
9. Implement complete/uncomplete toggle, edit, delete, archive.
10. Implement stats endpoint + ProgressRing + WeekChart components.
11. Implement Upcoming/Completed/Archive tab filtering and search.
12. Add light/dark theme toggle.
13. Write the production `Dockerfile`, verify `docker compose up --build` gives a fully
    working app from a clean checkout.
14. Do a side-by-side visual pass against the 7 reference screenshots; adjust spacing,
    color, and font-weight discrepancies.

---

## 9. Acceptance checklist

- [ ] `docker compose up --build` starts db + app with zero manual steps
- [ ] Can register, log out, log back in
- [ ] Can add a task via modal with all fields, it appears under Today
- [ ] Checking a task strikes it through, updates ring %, updates "X of Y finished"
- [ ] Completed/Archive tabs correctly filter
- [ ] Stats card shows an accurate weekly bar chart and streak count
- [ ] Landing, auth, and dashboard visually match the reference screenshots' layout,
      spacing, type scale, and color palette
- [ ] No console errors; unauthenticated users can't hit `/api/tasks`
