# PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Project Title:** DecodeLabs Industrial Training Program — Full Stack Qualification Platform  
**Modules Covered:** Week 1 ("The Skin" — Responsive Interface) & Week 2 ("The Nervous System" — RESTful Engine)  
**Author:** Ahmed Iqbal (Full Stack Engineering Intern) & Senior Architecture Team  
**Document Version:** 2.0.0 (Production Verified)  
**Target Audience:** DecodeLabs Technical Mentors, Evaluators, and Engineering Leads  
**Repository:** `axediqbal/ResponsiveFrontEndInterface`  

---

## 1. Executive Summary & Product Vision

### 1.1 The Challenge
Modern software engineering education frequently suffers from two disconnected extremes:
1. **Fragile Frontend ("Skin without Skeleton"):** Web pages that look visually pleasing in static Figma mockups or full desktop displays, but completely break, overflow horizontally, or become unusable on mobile devices and variable browser windows.
2. **Disconnected Backend ("Ghost Architecture"):** Static user interfaces with no live data layer, or makeshift backend APIs that lack schema validation, latency telemetry, rate limiting, and database failover mechanisms.

### 1.2 The Solution
This platform serves as a complete, unified qualification and demonstration portal built strictly to **Pure Web Standards** (Vanilla HTML5, CSS3, ES6+ JavaScript, Node.js, Express, and Supabase PostgreSQL). 

It synthesizes two core milestones:
- **Week 1 (The Skin):** A resilient, mathematically responsive fluid layout featuring 2026 Liquid Glassmorphism, real-time theme toggling (`mocha` vs `light`), an ambient hardware-accelerated video backdrop, a dynamic typewriter console, a 6-milestone internship roadmap with `localStorage` persistence, and an interactive survival toolkit.
- **Week 2 (The Nervous System):** A production-grade RESTful API engine equipped with Gatekeeper validation middleware ("The Blood-Brain Barrier"), an autonomic rate-limiting defense, a latency critical-path telemetry logger, an educational HTTP status simulator, a live Input-Process-Output (IPO) system pulse, and dual-tier failover data persistence (Supabase Cloud PostgreSQL + Local JSON Vault).

---

## 2. Target Personas & Stakeholder Needs

| Stakeholder Persona | Profile & Context | Core Expectations & Needs |
| :--- | :--- | :--- |
| **Ahmed Iqbal** *(The Intern / Candidate)* | Full Stack Trainee demonstrating industrial competency. | Needs a single cohesive workspace to generate, track, and showcase qualification credentials without reliance on heavy frontend framework overhead. |
| **DecodeLabs Mentors** *(The Technical Evaluators)* | Senior Architects evaluating code quality, semantics, and robustness. | Need to verify clean semantic HTML5, zero CSS horizontal overflow on mobile viewports (< 480px), strict RESTful API naming conventions, robust error handling, and cloud database integration. |
| **Industry Recruiters** *(External Observers)* | Potential employers reviewing portfolio depth. | Expect sub-second response times, aesthetic cybernetic visuals, live interactive sandboxes, and production-ready architectural documentation. |

---

## 3. Product Scope & Functional Milestones

### 3.1 Milestone 1: "The Skin" (Week 1 — Frontend Architecture)
- **Fluid 2D Grid Floorplan:** Responsive layout that auto-adapts from 2560px 4K monitors down to 320px mobile screens with zero horizontal overflow (`minmax(0, 1fr)`).
- **Dual-Mode Theme Engine:** Seamless switching between Cyber Mocha (Dark Mode) and Ethereal Light (Light Mode) via CSS custom properties.
- **Hardware-Accelerated Atmosphere:** Ambient video background running smoothly at 60fps (`position: fixed; inset: 0; pointer-events: none; z-index: 0;`) that never blocks clicks or inputs.
- **Dynamic Terminal Typewriter:** Real-time typewriter console cycling through qualification credentials and operational statuses.
- **Internship Roadmap Tracker:** 6 interactive milestones (PDF Page 12) with completion toggling and persistent browser `localStorage` synchronization.
- **Industrial Survival Toolkit:** Interactive modal cards detailing Git workflows, CSS layouts, keyboard shortcuts, and debugging guidelines.
- **Mobile Navigation Drawer:** Slide-out touch-friendly drawer for seamless mobile navigation.

### 3.2 Milestone 2: "The Nervous System" (Week 2 — Backend API & Data Engine)
- **RESTful CRUD Resource (`/api/badges`):** Full creation, retrieval, filtering, updating, and revocation of intern qualification credentials.
- **Gatekeeper Middleware ("Blood-Brain Barrier"):** Strict schema verification rejecting malformed emails, empty names, and unauthorized payload structures (HTTP 400 Bad Request).
- **Dual-Tier Failover Persistence:**
  - *Tier 1 (Cloud Primary):* Supabase Cloud PostgreSQL with automated connection pooling and timeout handling.
  - *Tier 2 (Vault Fallback):* Local `backend/data/badges.json` database ensuring 100% application uptime during offline work or API outages.
  - *Vercel Compatibility:* Automatic routing to `/tmp` storage when deployed in read-only serverless lambdas.
- **Latency Critical-Path Telemetry:** Request logger recording timestamp, HTTP method, client IP, route URL, status code, and latency duration in milliseconds.
- **Autonomic Rate-Limiter Defense:** Sliding window rate limiter preventing denial-of-service spam (HTTP 429 Too Many Requests).
- **System Pulse & IPO Visualizer:** Real-time vitals ticker monitoring server uptime, Node.js memory footprint (RSS / Heap), and database connection mode (PDF Page 7 & 18).
- **Interactive HTTP Status Sandbox:** Educational endpoint `/api/simulator/status/:code` enabling testing of HTTP 200, 201, 400, 401, 403, 404, 429, and 500 behaviors.

---

## 4. User Stories & Acceptance Criteria

### US-1: Fluid Cross-Device Responsiveness
> *As a user opening the site on any phone, tablet, or desktop, I want all cards, action pills, and text to adapt smoothly without any horizontal scrollbars.*
- **AC 1.1:** Viewport width between 320px and 2560px exhibits zero horizontal scrolling (`overflow-x: hidden`).
- **AC 1.2:** On mobile screens (< 768px), the layout collapses into a single-column grid using `minmax(0, 1fr)`.
- **AC 1.3:** Action pills and skill badges wrap naturally with `white-space: normal` and `word-break: break-word`.

### US-2: Credential Issuance & Live Synchronization
> *As an intern, I want to submit my name, email, clearance tier, and skills through the form and immediately see my verified badge in the showcase.*
- **AC 2.1:** Submitting the form sends a `POST /api/badges` request with sanitized JSON payload.
- **AC 2.2:** Valid submissions return HTTP 201 Created and dynamically append the badge to the DOM without a page reload.
- **AC 2.3:** Invalid inputs (e.g. empty name, invalid email format) trigger immediate inline error toast messages (HTTP 400).
- **AC 2.4:** Newly created badges persist across server restarts (stored in Supabase Cloud or Local JSON Vault).

### US-3: Real-Time Badge Revocation
> *As an evaluator, I want the ability to delete any test badge directly from the interface.*
- **AC 3.1:** Clicking the delete icon issues a `DELETE /api/badges/:id` call.
- **AC 3.2:** Successful deletion removes the badge from the UI with a fade-out transition and purges the record from storage.

### US-4: System Pulse & Telemetry Monitoring
> *As an engineer, I want to observe live server health, uptime, and latency directly from the web console.*
- **AC 4.1:** The System Pulse panel queries `GET /api/system/pulse` every 5 seconds.
- **AC 4.2:** Uptime is displayed in human-readable format; memory usage is displayed in MB; active database source (Supabase Cloud vs Local Vault) is visibly indicated.

---

## 5. Non-Functional Requirements (NFRs)

1. **Zero Framework Bloat:** Built with 100% native Web Standards. No React, Vue, Angular, or Tailwind runtime overhead.
2. **Performance Budget:**
   - First Contentful Paint (FCP) < 1.0s.
   - API response latency < 100ms for local vault, < 400ms for cloud database queries.
3. **Fault Tolerance & Resilience:**
   - Database operations are wrapped with a 3500ms timeout circuit breaker.
   - Server never terminates ungracefully on unhandled exceptions; errors are trapped by the semantic `globalErrorHandler`.
4. **Security & Data Sanitization:**
   - CORS restricted to standard web methods.
   - Body parser payload limited to 1MB to prevent memory exhaustion attacks.
   - In-memory rate limiting defense against brute-force spam.
