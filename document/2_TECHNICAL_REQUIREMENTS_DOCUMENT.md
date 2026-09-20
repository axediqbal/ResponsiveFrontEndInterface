# TECHNICAL REQUIREMENTS DOCUMENT (TRD)
**Project Title:** DecodeLabs Industrial Training Program — Full Stack Qualification Platform  
**Modules Covered:** Week 1 ("The Skin") & Week 2 ("The Nervous System")  
**Runtime Environment:** Node.js v18+ (ES Modules) / Modern Evergreen Browsers / Vercel Serverless  
**Document Version:** 2.0.0 (Production Verified)  
**Author:** Ahmed Iqbal & Senior Architecture Team  

---

## 1. System Architecture Overview

The system is built as a Decoupled Monolith adhering to Clean Layered Architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE SKIN: FRONTEND PRESENTATION LAYER                │
│                                                                        │
│   [index.html] Semantic Structure & Accessible Landmark Hierarchy      │
│   [CSS Chunks] variables.css ──► base.css ──► layout.css ──► glass.css │
│                chunks/week1-ui.css ──► chunks/week2-nervous.css        │
│                chunks/mobile-nav.css (Zero-Overflow Mobile Rules)      │
│   [JS Modules] app.js ──► week1/ (typewriter, theme, roadmap, toolkit) │
│                       ──► week2/ (badge, apiConsole, systemPulse)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON (RESTful API Protocol)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                THE NERVOUS SYSTEM: BACKEND EXPRESS PIPELINE            │
│                                                                        │
│   1. CORS [cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'] })]
│   2. Body Parser [express.json({ limit: '1mb' })]                      │
│   3. Telemetry Logger [middleware/logger.js] (Latency Critical Path)   │
│   4. Rate Limiter [middleware/rateLimiter.js] (Autonomic Defense)      │
│   5. Route Handlers:                                                   │
│      ├── /api/system    ──► controllers/systemController.js            │
│      ├── /api/badges    ──► [Gatekeeper] ──► badgeController.js        │
│      └── /api/simulator ──► controllers/simulatorController.js         │
│   6. Error Boundaries [notFoundHandler ──► globalErrorHandler]        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     PRIMARY PERSISTENCE TIER      │ │     SECONDARY FALLBACK TIER       │
│  Supabase Cloud (PostgreSQL 15)   │ │    Local JSON Database (Vault)    │
│    - Hosted Relational DB         │ │      - backend/data/badges.json   │
│    - @supabase/supabase-js        │ │      - Vercel /tmp auto-routing   │
│    - 3.5s Circuit Breaker Timeout │ │      - Guaranteed 100% Uptime     │
└───────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 2. Directory Structure & Codebase Map

Every file in the repository has a single, well-defined responsibility:

```
WEEK 1 AND 2/
├── backend/
│   ├── controllers/
│   │   ├── badgeController.js      # CRUD operations + Dual-Tier Supabase/Vault failover
│   │   ├── simulatorController.js  # Educational status code simulator & API catalog
│   │   └── systemController.js     # Health, pulse vitals, and database status
│   ├── data/
│   │   └── badges.json             # Local JSON persistence vault (Tier 2 DB)
│   ├── middleware/
│   │   ├── errorHandler.js         # Semantic 404 & 500 error boundaries (PDF Page 13 & 14)
│   │   ├── gatekeeper.js           # Blood-Brain Barrier payload validation (PDF Page 11)
│   │   ├── logger.js               # Latency critical-path telemetry logger (PDF Page 6 & 8)
│   │   └── rateLimiter.js          # Autonomic rate limiter defense (PDF Page 14 & 15)
│   ├── routes/
│   │   ├── badgeRoutes.js          # /api/badges routing (Nouns as Resources)
│   │   ├── simulatorRoutes.js      # /api/simulator routing
│   │   └── systemRoutes.js         # /api/system routing
│   └── server.js                   # Main application entry point & server bootstrap
├── frontend/
│   ├── css/
│   │   ├── base.css                # Box-sizing reset, typography defaults, scrollbar styles
│   │   ├── glass.css               # Backdrop blur, borders, specular highlights
│   │   ├── layout.css              # 2D Grid floorplan & responsive breakpoints
│   │   ├── variables.css           # CSS custom properties (Mocha & Light themes)
│   │   └── chunks/
│   │       ├── mobile-nav.css      # Mobile navigation drawer & zero-overflow safety
│   │       ├── week1-ui.css        # Hero, Roadmap, Survival Toolkit, Simulator UI
│   │       └── week2-nervous.css   # API Console, System Pulse, Badge Generator UI
│   ├── js/
│   │   ├── app.js                  # Frontend master coordinator
│   │   ├── week1/
│   │   │   ├── mouseScrub.js       # Background video parallax & scrubbing
│   │   │   ├── navbar.js           # Navigation bar interactions & scroll observation
│   │   │   ├── roadmap.js          # 6-milestone tracker with localStorage sync
│   │   │   ├── simulator.js        # Interactive sandbox frontend trigger
│   │   │   ├── theme.js            # Dual-theme toggling engine (Mocha / Light)
│   │   │   ├── toolkit.js          # Survival Toolkit modals & tab switching
│   │   │   └── typewriter.js       # Dynamic terminal typewriter animation
│   │   └── week2/
│   │       ├── apiConsole.js       # Interactive REST API testing console
│   │       ├── badge.js            # Badge creation, listing, filtering, and deletion
│   │       └── systemPulse.js      # System vitals live polling & IPO visualizer
│   └── index.html                  # Semantic HTML5 skeleton with accessibility attributes
├── document/
│   ├── 1_PRODUCT_REQUIREMENTS_DOCUMENT.md
│   ├── 2_TECHNICAL_REQUIREMENTS_DOCUMENT.md
│   ├── 3_UI_UX_DESIGN_DOCUMENT.md
│   └── 4_BACKEND_SCHEMA_DOCUMENT.md
├── package.json                    # Dependencies & execution scripts
├── vercel.json                     # Serverless rewrite configuration for Vercel deployment
└── README.md                       # Comprehensive repository documentation
```

---

## 3. Middleware Pipeline Specification

Requests to the backend API pass through a strictly ordered pipeline:

```
[Incoming Request]
        │
        ▼
┌──────────────────┐
│       cors       │  Allows cross-origin requests from any frontend port.
└────────┬─────────┘
        ▼
┌──────────────────┐
│   express.json   │  Parses JSON request bodies up to 1MB size limit.
└────────┬─────────┘
        ▼
┌──────────────────┐
│ telemetryLogger  │  Calculates request latency: (Date.now() - startTime)ms.
└────────┬─────────┘  Logs: [TIMESTAMP] [METHOD] [URL] [STATUS] [LATENCY ms]
        ▼
┌──────────────────┐
│autonomicRateLimit│  Maintains an in-memory sliding window map of client IPs.
└────────┬─────────┘  Rejects excessive requests with HTTP 429 Too Many Requests.
        ▼
┌──────────────────┐
│    Gatekeeper    │  Applied to POST /api/badges. Validates fields, trims strings,
└────────┬─────────┘  checks email regex. Rejects invalid payloads with HTTP 400.
        ▼
┌──────────────────┐
│ Controller Action│  Executes database read/write with dual-tier failover.
└────────┬─────────┘
        ▼
┌──────────────────┐
│  Error Handlers  │  notFoundHandler (404) & globalErrorHandler (500).
└──────────────────┘
```

---

## 4. Dual-Tier Failover Engine Implementation

In `backend/controllers/badgeController.js`, data resilience is guaranteed through an active/passive failover pattern:

1. **Supabase Cloud Initializer:**
   - Detects `SUPABASE_URL` and `SUPABASE_KEY` (Service Role or Anon Key).
   - If present, initializes client with `auth: { persistSession: false }`.
2. **Circuit Breaker Timeout (`withTimeout`):**
   - Every Supabase operation is wrapped in a 3500ms timeout promise.
   - If the network latency exceeds 3.5s, the promise rejects without blocking Express.
3. **Local Vault Fallback:**
   - If Supabase is unconfigured, unreachable, or times out, the controller reads/writes to `backend/data/badges.json`.
4. **Vercel Serverless `/tmp` Auto-Switching:**
   - Detects `process.env.VERCEL`. If active, file writes are directed to `/tmp/badges.json` since serverless execution roots are strictly read-only.
5. **Bidirectional Schema Normalizer:**
   - Converts PostgreSQL `snake_case` fields (`intern_name`, `clearance_level`, `issued_at`) into standard client `camelCase` properties (`internName`, `clearanceLevel`, `issuedAt`).

---

## 5. Execution & Deployment Architecture

### 5.1 Local Execution
```bash
# Install dependencies
npm install

# Run backend API server and static frontend (Port 5500)
node backend/server.js
# Or using npm:
npm start
```

### 5.2 Vercel Serverless Deployment
Deployment is defined via [vercel.json](file:///c:/Users/Dell/Desktop/ahmed/Decodelab%20Intern/WEEK%201%20AND%202/vercel.json):
```json
{
  "version": 2,
  "builds": [
    { "src": "backend/server.js", "use": "@vercel/node" },
    { "src": "frontend/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/server.js" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```
This enables zero-configuration serverless execution where all `/api/*` traffic routes into the Express application while static assets are served from Vercel's global CDN edge.
