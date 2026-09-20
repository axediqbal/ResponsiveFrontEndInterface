# TECHNICAL REQUIREMENTS DOCUMENT (TRD)
**Project Name:** DecodeLabs Full Stack Engineering — Qualification & Showcase Platform  
**Document Version:** 1.0.0  
**Target Environment:** Node.js v18+ / Modern Browsers (Chromium, Firefox, Safari) / Vercel Serverless  
**Architectural Paradigm:** Clean Layered Architecture (Pure Web Standards + Express REST API)  

---

## 1. System Architecture Overview

The system is structured as a decoupled, monolithic repository following high-cohesion, low-coupling principles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│  Pure HTML5 Semantic Skeleton + Modular CSS Architecture + Vanilla JS  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON (REST API)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API & MIDDLEWARE LAYER                  │
│                     Node.js / Express Application                      │
│                                                                        │
│   [CORS] ──► [express.json] ──► [RequestLogger] ──► [RateLimiter]      │
│                                                          │             │
│                                             [Gatekeeper Validator]     │
│                                                          │             │
│                                                    [Controllers]       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     PRIMARY PERSISTENCE TIER      │ │     SECONDARY FALLBACK TIER       │
│  Supabase Cloud (PostgreSQL 15)   │ │   Local JSON Database (Vault)     │
│    - Hosted cloud database        │ │     - backend/data/badges.json    │
│    - Row Level Security (RLS)     │ │     - Vercel /tmp memory vault    │
│    - Indexed query execution      │ │     - Zero-downtime offline mode  │
└───────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 2. Technology Stack Selection

| Component | Technology | Rationale & Architectural Trade-offs |
| :--- | :--- | :--- |
| **Frontend Core** | Pure HTML5, CSS3, ES6+ JS | Zero compilation build step; instant browser reloading; deep mastery of browser primitives over heavy framework abstractions. |
| **Styling Strategy** | Modular CSS + CSS Custom Properties | Maintainable CSS split by concern (`variables`, `base`, `layout`, `components`, `responsive`). No Tailwind bundle bloat. |
| **Runtime Environment** | Node.js (ES Modules `import/export`) | Native modern JS syntax across client and server. Non-blocking I/O ideal for RESTful JSON handling. |
| **Web Server Framework** | Express.js 4.x | Minimalist, predictable middleware pipeline, industry-standard routing engine. |
| **Primary Database** | Supabase (Managed PostgreSQL) | Relational SQL integrity, ACID compliance, enterprise cloud scalability, automated backups. |
| **Fallback Database** | Node.js File System (`fs`) JSON Vault | Guaranteed uptime even when cloud internet is disconnected or credentials are missing. |
| **Deployment Engine** | Vercel Serverless Functions | Edge-ready serverless execution with instant continuous integration from GitHub. |

---

## 3. Directory & Module Boundaries

The project enforces clean separation between static assets, business logic, middleware, and data layers:

```
WEEK 1 AND 2/
├── backend/
│   ├── controllers/
│   │   └── badgeController.js      # Core CRUD logic & Supabase/Vault failover engine
│   ├── data/
│   │   └── badges.json             # Local JSON persistence database
│   ├── middleware/
│   │   ├── gatekeeper.js           # Request payload sanitization & schema validation
│   │   ├── logger.js               # Structured console telemetry logging
│   │   └── rateLimiter.js          # In-memory DoS protection against spam submissions
│   ├── routes/
│   │   ├── badgeRoutes.js          # /api/badges route definitions
│   │   ├── healthRoutes.js         # /api/health uptime check
│   │   └── telemetryRoutes.js      # /api/telemetry system metrics
│   └── server.js                   # Express application initialization & middleware assembly
├── frontend/
│   ├── css/
│   │   ├── variables.css           # Design tokens (colors, fonts, glass formulas)
│   │   ├── base.css                # Box-sizing reset, typography baseline
│   │   ├── layout.css              # 2D Grid floorplan, header/main/footer positioning
│   │   ├── components.css          # Glass panels, badge cards, forms, buttons
│   │   └── responsive.css          # Viewport media queries & mobile safety rules
│   ├── js/
│   │   ├── app.js                  # DOM binding, UI events, typewriter, theme switcher
│   │   └── api.js                  # Frontend HTTP client (fetch wrapper with error handling)
│   └── index.html                  # Accessible, semantic document skeleton
├── document/                       # Architecture & Foundation Specifications
│   ├── 1_PRODUCT_REQUIREMENTS_DOCUMENT.md
│   ├── 2_TECHNICAL_REQUIREMENTS_DOCUMENT.md
│   ├── 3_UI_UX_DESIGN_DOCUMENT.md
│   └── 4_BACKEND_SCHEMA_DOCUMENT.md
├── package.json                    # Project metadata & npm dependencies
├── vercel.json                     # Serverless rewrite rules for Vercel cloud deployment
└── README.md                       # Comprehensive onboarding & project guide
```

---

## 4. Middleware Pipeline Specification

Every incoming HTTP request to `/api/*` passes through the following synchronous and asynchronous pipeline:

1. **CORS Middleware:** Injects `Access-Control-Allow-Origin: *` and allowable methods (`GET, POST, PUT, DELETE, OPTIONS`) to permit cross-origin requests.
2. **Body Parser:** `express.json({ limit: '100kb' })` extracts JSON payload into `req.body`, preventing oversized body buffer overflow attacks.
3. **Structured Request Logger:** Logs `[TIMESTAMP] [METHOD] [URL] [CLIENT_IP] [USER_AGENT]` for audit trails and telemetry.
4. **Rate Limiter:** Restricts client IPs to a maximum threshold of requests per 15-minute window to protect compute resources.
5. **Gatekeeper Validator:** Intercepts `POST` requests to validate field presence, data types, string lengths, and email regex before reaching the database controller.
6. **Global Error Handler:** Catches unhandled promise rejections, logs stack traces securely, and returns standardized JSON `{ success: false, error: "Internal Server Error" }` with HTTP 500.

---

## 5. Dual-Tier Failover Engine

The controller implements resilient database failover:

```javascript
// Pseudo-code logic of dual-tier failover
if (isSupabaseConfigured()) {
  try {
    const cloudData = await withTimeout(querySupabase(), 3500);
    return res.status(200).json({ source: 'supabase_cloud', data: cloudData });
  } catch (cloudError) {
    console.warn('Cloud database unreachable. Falling back to local vault...', cloudError);
  }
}
// Guaranteed fallback
const localData = readLocalVault();
return res.status(200).json({ source: 'local_vault', data: localData });
```

- **Cloud First:** If `SUPABASE_URL` and `SUPABASE_KEY` are provided, the API reads/writes to PostgreSQL.
- **Circuit Breaker:** Every cloud query is wrapped with a 3.5-second timeout (`withTimeout`) to prevent request hanging on slow networks.
- **Instant Fallback:** If the cloud query errors or times out, the local `badges.json` vault is read/written transparently without returning a 500 error to the client.
- **Serverless Compatibility:** On Vercel, the file system root is read-only; the fallback automatically switches to `/tmp/badges.json` to avoid write permission exceptions.
