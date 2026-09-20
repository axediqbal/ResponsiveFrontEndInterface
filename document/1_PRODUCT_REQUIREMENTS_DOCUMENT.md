# PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Project Name:** DecodeLabs Full Stack Engineering — Qualification & Showcase Platform  
**Document Version:** 1.0.0 (Production Architecture)  
**Author:** Ahmed Iqbal (Full Stack Engineering Intern) & Senior Architecture Team  
**Milestone:** Week 1 (The Responsive Interface) & Week 2 (The RESTful Nervous System)  
**Status:** Approved & Implemented  

---

## 1. Executive Summary & Vision

### 1.1 The Problem
In modern web development, beginner projects often suffer from two major flaws:
1. **Fragile Frontend ("Skin without Skeleton"):** Beautiful visual mockups that collapse, horizontally overflow, or become unreadable when opened on mobile devices or varied screen viewports.
2. **Disconnected Backend ("Ghost Architecture"):** Static websites that have no dynamic state, or backend APIs that fail silently without proper validation, error handling, or dual-layer persistence.

### 1.2 The Solution
This platform is an enterprise-grade, responsive qualification showcase built from the ground up without heavy third-party framework overhead. It demonstrates:
- **Week 1 Foundation:** A resilient, mathematically responsive fluid layout using pure HTML5 semantics and modular CSS architecture (Liquid Glassmorphism aesthetic, theme switcher, hardware-accelerated live video background, zero-overflow mobile grid).
- **Week 2 Foundation:** A complete RESTful API "Nervous System" powered by Node.js/Express with strict Gatekeeper validation middleware, dual-tier failover persistence (Supabase Cloud PostgreSQL + Local JSON Vault fallback), live badge issuance, and telemetry monitoring.

---

## 2. Target Audiences & Personas

| Persona | Role | Key Needs & Expectations |
| :--- | :--- | :--- |
| **The Candidate (Intern)** | Creator / Ahmed Iqbal | Needs an intuitive, cybernetic interface to issue, view, filter, and verify qualification credentials across all devices. |
| **The Tech Lead / Evaluator** | DecodeLabs Mentors | Needs to verify semantic HTML cleanliness, CSS modularity, REST API compliance, data validation security, and zero console errors. |
| **The End User / Recruiter** | External Viewer | Needs an ultra-fast loading (< 1.5s), aesthetic interface that highlights technical competence with instant visual feedback. |

---

## 3. Scope Matrix

### 3.1 In-Scope (Implemented & Live)
- **Responsive 2D Grid Layout:** Fluid desktop floorplan with seamless collapsible mobile single-column stacking (`minmax(0, 1fr)`).
- **Theme Switching Engine:** Dynamic switching between Cyber Mocha (`mocha`) and Ethereal Light (`light`) modes with instant CSS variable propagation.
- **Hardware-Accelerated Atmosphere:** Background ambient video layer running smoothly at 60fps behind high-contrast glass panels without blocking click events.
- **Real-Time Typewriter Console:** Dynamic headline typing effect with blinking cursor indicating active clearance status.
- **RESTful Badge Management:** Complete CRUD endpoints (`GET`, `POST`, `DELETE`) for intern qualification credentials.
- **Gatekeeper Validation Pipeline:** Strict payload verification rejecting empty names, malformed emails, and invalid tier assignments.
- **Dual-Tier Data Resilience:** Primary storage on Supabase Cloud PostgreSQL with automatic failover to local JSON persistence if offline or unconfigured.
- **System Telemetry:** Live health check endpoint reporting server uptime, memory consumption, and active database mode.

### 3.2 Out-of-Scope (Reserved for Future Weeks)
- **OAuth2 / Multi-Tenant Auth:** User sign-in with Google/GitHub (to be explored in Week 3).
- **Automated PDF Certificate Generation:** Server-side canvas rendering for printable certificates.
- **Email Notifications:** Automated email dispatch via SendGrid/Resend upon badge issuance.
- **WebSockets / Live Push:** Full duplex bidirectional live updates (currently handled via optimistic UI and polling).

---

## 4. Core User Stories & Acceptance Criteria

### User Story 1: Fluid Cross-Device Exploration (Week 1 Focus)
> *As a user on any device (from a 360px Android phone to a 4K desktop monitor), I want the layout, typography, and interactive cards to adapt smoothly without any horizontal scrollbars or clipped text.*
- **Acceptance Criteria:**
  - Viewport width from 320px to 2560px displays zero horizontal overflow.
  - Action pills wrap naturally across lines without expanding parent card boundaries.
  - Video background remains fixed in the background and does not intercept clicks or form inputs.
  - Theme toggler updates all background, text, border, and glassmorphic colors instantly.

### User Story 2: Credential Issuance & Live Synchronization (Week 2 Focus)
> *As an intern, I want to submit my name, email, clearance tier, track, and skills through the terminal form and immediately see my verified badge appear in the showcase list.*
- **Acceptance Criteria:**
  - Form submission triggers a `POST /api/badges` request with proper JSON body.
  - Invalid inputs (e.g. empty name, bad email) trigger clear inline or toast error feedback (HTTP 400).
  - Successful submission returns HTTP 201 Created and updates the UI badge list without requiring a manual page refresh.
  - Badges persist across page reloads (stored in Supabase Cloud or Local JSON Vault).

### User Story 3: Badge Deletion & Revocation
> *As an administrator/evaluator, I want the ability to revoke/delete a badge from the showcase.*
- **Acceptance Criteria:**
  - Clicking the delete icon issues a `DELETE /api/badges/:id` call.
  - The deleted badge fades out and is purged from both the database and DOM.

---

## 5. Non-Functional Requirements (Quality Attributes)

1. **Performance:** 
   - First Contentful Paint (FCP) < 1.0s on broadband.
   - API response latency < 150ms for local vault, < 400ms for Supabase cloud queries.
2. **Reliability & Fault Tolerance:**
   - Server must never crash on malformed JSON or unhandled database exceptions.
   - If Supabase Cloud goes unreachable or times out (>3.5s), system gracefully falls back to local storage without throwing a 500 error to the client.
3. **Accessibility (a11y):**
   - Minimum WCAG AA contrast ratio for text on glass surfaces.
   - Form inputs with clear labels, focus states, and aria attributes.
4. **Code Quality:**
   - Pure Web Standards (Vanilla JS + CSS variables), zero bloated client frameworks.
   - 100% clean browser console with zero uncaught runtime errors.
