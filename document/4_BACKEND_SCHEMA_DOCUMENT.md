# BACKEND SCHEMA & API CONTRACT DOCUMENT
**Project Title:** DecodeLabs Industrial Training Program — Full Stack Qualification Platform  
**Modules Covered:** Week 1 ("The Skin") & Week 2 ("The Nervous System")  
**Primary Database:** Supabase Cloud (PostgreSQL 15)  
**Secondary Database:** Local JSON Persistence Vault (`backend/data/badges.json`)  
**Protocol:** RESTful JSON over HTTP  
**Document Version:** 2.0.0 (Production Verified)  

---

## 1. Cloud PostgreSQL DDL (Supabase Schema)

The database schema definition for the primary `badges` table in Supabase:

```sql
-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Qualification Badges Table Definition
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'Novice',
    track VARCHAR(100) NOT NULL DEFAULT 'Full Stack Engineering',
    clearance_level VARCHAR(50) NOT NULL DEFAULT 'L1-Operator',
    project_name VARCHAR(255) NOT NULL DEFAULT 'The Responsive Architecture & Nervous System',
    status VARCHAR(50) NOT NULL DEFAULT 'Verified',
    skills JSONB NOT NULL DEFAULT '["HTML5 Semantics", "CSS Grid Floorplans", "REST API Integration", "Gatekeeper Validation"]'::jsonb,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes for Search & Filter Queries
CREATE INDEX IF NOT EXISTS idx_badges_email ON badges(email);
CREATE INDEX IF NOT EXISTS idx_badges_tier ON badges(tier);
CREATE INDEX IF NOT EXISTS idx_badges_issued_at ON badges(issued_at DESC);
```

---

## 2. Local JSON Vault Schema (Tier 2 Offline Failover)

When running locally without internet, or during Supabase network timeouts (> 3.5s), data is persisted to [backend/data/badges.json](file:///c:/Users/Dell/Desktop/ahmed/Decodelab%20Intern/WEEK%201%20AND%202/backend/data/badges.json):

```json
[
  {
    "id": "7f8b9e12-4c3a-49d6-8a71-92b0c1e8aa14",
    "internName": "Ahmed Iqbal",
    "email": "ahmed.iqbal@decodelabs.dev",
    "tier": "Grandmaster",
    "track": "Full Stack Architecture",
    "clearanceLevel": "L3-Architect",
    "projectName": "The Responsive Architecture & Nervous System",
    "status": "Verified",
    "skills": [
      "HTML5 Semantics",
      "CSS Grid Floorplans",
      "Express REST Nervous System",
      "Gatekeeper Validation",
      "Supabase Cloud Dual-Tier"
    ],
    "issuedAt": "2026-09-20T10:00:00.000Z"
  }
]
```

### Bidirectional Normalizer Layer
PostgreSQL defaults to `snake_case` column names (`intern_name`, `clearance_level`, `issued_at`), whereas the frontend JavaScript client expects `camelCase` properties (`internName`, `clearanceLevel`, `issuedAt`).

The normalizer function in `backend/controllers/badgeController.js` bridges both worlds:
```javascript
function normalizeBadge(row) {
  let parsedSkills = row.skills;
  if (typeof parsedSkills === 'string') {
    try { parsedSkills = JSON.parse(parsedSkills); } catch { parsedSkills = [parsedSkills]; }
  }
  return {
    id: row.id,
    internName: row.intern_name || row.internName || 'Anonymous Operative',
    email: row.email || '',
    tier: row.tier || 'Novice',
    track: row.track || 'Full Stack Engineering',
    clearanceLevel: row.clearance_level || row.clearanceLevel || 'L1-Operator',
    projectName: row.project_name || row.projectName || 'The Responsive Architecture & Nervous System',
    status: row.status || 'Verified',
    issuedAt: row.issued_at || row.issuedAt || new Date().toISOString(),
    skills: Array.isArray(parsedSkills) && parsedSkills.length > 0 ? parsedSkills : [
      'HTML5 Semantics',
      'CSS Grid Floorplans',
      'REST API Integration',
      'Gatekeeper Validation'
    ]
  };
}
```

---

## 3. Gatekeeper Validation Contract (The Blood-Brain Barrier)

Middleware in `backend/middleware/gatekeeper.js` intercepts all `POST /api/badges` requests:

| Field Name | Type | Validation Rules | Failure Status & Message |
| :--- | :--- | :--- | :--- |
| `internName` | String | Required. Trimmed length: 2 - 100 chars. | `400 Bad Request` — `"Field 'internName' is required (2-100 characters)."` |
| `email` | String | Required. Valid RFC 5322 regex pattern. | `400 Bad Request` — `"A valid email address is required."` |
| `tier` | String | Optional. Allowed: `Novice`, `Adept`, `Specialist`, `Grandmaster`. | Defaults to `"Novice"` if omitted or unrecognized. |
| `track` | String | Optional. Max 100 characters. | Defaults to `"Full Stack Engineering"`. |
| `skills` | Array | Optional. Array of strings (Max 10). | Defaults to foundational 4 skills if omitted. |

---

## 4. Complete REST API Catalog

### 4.1 Qualification Badges Resource (`/api/badges`)
- `GET /api/badges`: Retrieve list of all badges. Supports `?tier=Grandmaster` and `?search=ahmed`.
- `GET /api/badges/:id`: Retrieve single badge by UUID. Returns 404 if not found.
- `POST /api/badges`: Issue new badge. Passes through Gatekeeper validation. Returns `201 Created`.
- `PUT /api/badges/:id`: Update existing badge credentials. Returns `200 OK`.
- `DELETE /api/badges/:id`: Revoke badge from Supabase and Local Vault. Returns `200 OK`.

### 4.2 System Health & Vitals Resource (`/api/system`)
- `GET /api/system/health`: Lightweight uptime status for load balancers. Returns `{ status: "UP", timestamp: ... }`.
- `GET /api/system/pulse`: Full system vitals including uptime in seconds, Node.js memory footprint (`rssMB`, `heapUsedMB`), and total badge count.
- `GET /api/system/db-status`: Reports active database mode (`"Supabase Cloud PostgreSQL"` vs `"Local JSON Vault"`).

### 4.3 Educational Status Simulator Resource (`/api/simulator`)
- `GET /api/simulator/status/:code`: Emulates any HTTP status code (200, 201, 400, 401, 403, 404, 429, 500) with educational descriptions (PDF Page 13 & 14).
- `POST /api/simulator/echo`: Reflects request headers, query parameters, and payload back to the client for debugging.
- `GET /api/simulator/catalog`: Returns complete machine-readable OpenAPI-style catalog of all server routes.

---

## 5. HTTP Status Code Matrix & Standard Error Payloads

| Status Code | Semantic Meaning | Usage Context |
| :--- | :--- | :--- |
| **200 OK** | Success | Successful `GET`, `PUT`, or `DELETE` execution. |
| **201 Created** | Resource Created | Badge validated by Gatekeeper and stored in database. |
| **400 Bad Request** | Validation Failure | Payload rejected by Gatekeeper (e.g. invalid email). |
| **404 Not Found** | Resource Missing | Badge ID does not exist in Cloud or Vault. |
| **429 Too Many Requests** | Rate Limit Exceeded | Client IP exceeded autonomic rate limit window. |
| **500 Internal Error** | Server Exception | Caught gracefully by `globalErrorHandler`. |

### Standard Error JSON Shape
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    "A valid email address is required."
  ]
}
```
