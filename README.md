# 🌐 DecodeLabs | Full Stack Internship Program (Batch 2026)
> **Projects 1 & 2: The Responsive Architecture & The Nervous System**  
> *A Complete Strategic Execution Framework: Bridging Pure Frontend Visuals ("The Skin") with RESTful Backend Logic ("The Nerves & Brain").*

---

## 📖 Overview

This repository represents the full-stack engineering curriculum across **Week 1** and **Week 2** of the **DecodeLabs Industrial Training Program**:

- **Week 1 (Project 1: The Skin)**: Fluid, accessible responsive frontend architecture constructed 100% with native web standards (HTML5 Landmarks, CSS Grid 2D Macro Layouts, Flexbox, Liquid Glass 2026 aesthetics, WCAG 2.1 AA compliance).
- **Week 2 (Project 2: The Nervous System)**: High-performance Node.js/Express REST API engine featuring dual-layer Gatekeeper validation ("Never Trust the Client"), autonomic rate-limiting defense, high-resolution IPO latency telemetry, and interactive sandbox tooling.

---

## 🏆 Core Mandates & Full-Stack Architecture

### 🎨 Frontend (The Skin)
- **100% Pure Web Standards**: Semantic **HTML5**, modern **CSS3** (Grid & Flexbox), modular vanilla **JavaScript**.
- **Zero Heavy UI Frameworks**: Master native browser capabilities and responsive design principles.
- **Mobile-First Responsive Strategy**: Scales seamlessly across Mobile (`375px`), Tablet (`768px`), Laptop (`1024px`), and Ultrawide (`1280px+`).
- **Liquid Glass 2026 Aesthetics**: Color tokens (`--color-mocha-500`, `--color-ethereal-300`, `--color-moonlit-bg`), specular rim highlights, and ambient glow followers.

### 🧠 Backend (The Nervous System)
- **RESTful Resource Naming**: Clear noun-based resources and HTTP verb methods (`GET`, `POST`, `PUT`, `DELETE`).
- **The Gatekeeper Rule ("Never Trust the Client")**: Blood-Brain Barrier performing **Syntactic Validation** (schema/types) and **Semantic Validation** (domain rules) returning `400 Bad Request` with structured error arrays.
- **Status Code Precision**: Complete semantic signaling (`200 OK`, `201 Created` with `Location` header, `204 No Content`, `400 Bad Request`, `404 Not Found`, `429 Too Many Requests`, `500 Server Error`).
- **Autonomic Defense (Rate Limiter)**: Sliding-window limiter mitigating bursts with `X-RateLimit-*` and `Retry-After` headers.
- **High-Resolution Telemetry**: Nanosecond latency measurement via `process.hrtime` injected into `X-Response-Time` headers.

---

## 🔌 RESTful API Catalog

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/system/health` | System vitals, memory usage, CPU cores, uptime | `200 OK` |
| `GET` | `/api/system/pulse` | Live synaptic heartbeat, latency jitter, and ECG flow | `200 OK` |
| `GET` | `/api/badges` | Fetch all verified credentials (supports `?tier=` and `?search=`) | `200 OK` |
| `GET` | `/api/badges/:id` | Fetch specific credential by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/badges` | Issue new credential (**Gatekeeper Validated**) | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/badges/:id` | Update existing credential tier or notes | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/badges/:id` | Revoke a credential | `200 OK` / `404 Not Found` |
| `GET` | `/api/simulator/status/:code` | Educational simulator for any standard HTTP code | Requested Code |
| `POST` | `/api/simulator/echo` | IPO Model data echo with optional `?delay=ms` | `200 OK` |
| `GET` | `/api/simulator/catalog` | Complete OpenAPI-style pathway catalog | `200 OK` |

---

## 📁 Project Directory Structure

```text
├── index.html                 # Full-Stack Application UI & Landmark Structure
├── package.json               # Development server & ESM module configuration
├── css/
│   ├── variables.css          # 2026 Design tokens, color palette & typography
│   ├── base.css               # Modern CSS reset & global styles
│   ├── glass.css              # Liquid Glass & Glassmorphism 2.0 system
│   ├── layout.css             # CSS Grid floor-plans & responsive breakpoints
│   └── components.css         # UI modules, API Console & ECG Monitor
├── js/
│   ├── app.js                 # Master coordinator bootstrap
│   ├── navbar.js              # Floating island navigation & mobile drawer
│   ├── theme.js               # Multi-theme switcher & localStorage persistence
│   ├── simulator.js           # Multi-device responsive viewport simulator
│   ├── roadmap.js             # Interactive 6-step roadmap checklist
│   ├── toolkit.js             # Blueprint inspector & developer survival vault
│   ├── badge.js               # Qualification badge customizer & ledger sync
│   ├── systemPulse.js         # Real-time ECG canvas & health telemetry poller
│   └── apiConsole.js          # Interactive browser REST API test sandbox
├── server/
│   ├── server.js              # Express.js REST API bootstrap & middleware pipeline
│   ├── routes/
│   │   ├── systemRoutes.js    # Health & pulse endpoints
│   │   ├── badgeRoutes.js     # Credentials CRUD endpoints
│   │   └── simulatorRoutes.js # Status code & IPO latency simulator
│   ├── controllers/
│   │   ├── systemController.js    # Telemetry and vitals business logic
│   │   ├── badgeController.js     # Credential persistence & verification
│   │   └── simulatorController.js # Educational status & echo handling
│   ├── middleware/
│   │   ├── gatekeeper.js      # Blood-Brain Barrier (Syntactic + Semantic validation)
│   │   ├── logger.js          # Signal telemetry & latency timer (X-Response-Time)
│   │   ├── rateLimiter.js     # Autonomic Defense (HTTP 429 limiter)
│   │   └── errorHandler.js    # Centralized 404 & 500 error boundaries
│   └── data/
│       └── badges.json        # JSON file-backed credential storage
├── Full Stack Project 1.pdf   # DecodeLabs Project 1 Guidelines
└── Intership Survival Tool Kit.pdf # DecodeLabs Survival Guide
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/axediqbal/ResponsiveFrontEndInterface.git
   cd ResponsiveFrontEndInterface
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the unified Full-Stack server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:5500](http://localhost:5500).

---

## 📬 Contact & Attribution

- **Organization**: DecodeLabs Industrial Training Program
- **Location**: Greater Lucknow, India
- **Website**: [www.decodelabs.tech](https://www.decodelabs.tech)
- **Email**: [decodelabs.tech@gmail.com](mailto:decodelabs.tech@gmail.com)
- **Phone**: +91 89330 06408

---
*Created with ❤️ for DecodeLabs Full Stack Interns — Batch 2026.*

