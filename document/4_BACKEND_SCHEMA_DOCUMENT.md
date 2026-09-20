# BACKEND SCHEMA & API CONTRACT DOCUMENT
**Project Name:** DecodeLabs Full Stack Engineering — Qualification & Showcase Platform  
**Document Version:** 1.0.0  
**Database Engines:** Supabase Cloud (PostgreSQL 15) & Local File JSON Vault  
**Protocol:** RESTful JSON over HTTP  

---

## 1. Relational Database Schema (Supabase PostgreSQL)

The primary data entity is the **Badge** (Intern Qualification Credential). Below is the production Data Definition Language (DDL) applied to Supabase:

```sql
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Qualification Badges Table
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

-- Indexing for rapid queries
CREATE INDEX IF NOT EXISTS idx_badges_email ON badges(email);
CREATE INDEX IF NOT EXISTS idx_badges_tier ON badges(tier);
CREATE INDEX IF NOT EXISTS idx_badges_issued_at ON badges(issued_at DESC);
```

---

## 2. Local JSON Vault Schema (Fallback Tier)

When running offline or during network outages, the system utilizes `backend/data/badges.json`. The schema contract matches the cloud structure using normalized camelCase keys:

```json
[
  {
    "id": "c1f72879-1193-41bb-98a4-0c2c31e8aa14",
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
      "Supabase PostgreSQL Dual-Tier"
    ],
    "issuedAt": "2026-09-20T10:00:00.000Z"
  }
]
```

### Schema Normalization Layer
Because PostgreSQL returns `snake_case` fields (e.g. `intern_name`) while JavaScript frontend conventions prefer `camelCase` (e.g. `internName`), the controller utilizes a bidirectional normalizer function `normalizeBadge(row)` that guarantees uniform JSON output regardless of data source.

---

## 3. Gatekeeper Validation Contract

Incoming requests to `POST /api/badges` are strictly validated by `backend/middleware/gatekeeper.js` before being passed to controllers:

| Field Name | Type | Rules & Constraints | Error Message on Failure |
| :--- | :--- | :--- | :--- |
| `internName` / `name` | String | Required; 2 - 100 characters; trimmed | `"Field 'internName' is required (2-100 characters)."` |
| `email` | String | Required; valid RFC 5322 email regex pattern | `"A valid email address is required."` |
| `tier` | String | Optional; Enum: `Novice`, `Adept`, `Specialist`, `Grandmaster` | Defaults to `"Novice"` if omitted. |
| `track` | String | Optional; 3 - 100 characters | Defaults to `"Full Stack Engineering"`. |
| `skills` | Array | Optional; Array of strings (Max 10 skills) | Defaults to core 4 skills if omitted. |

---

## 4. RESTful API Endpoint Catalog

### 4.1 List All Badges
- **URL:** `GET /api/badges`
- **Query Parameters:**
  - `tier` *(optional)*: Filter by badge tier (e.g. `?tier=Grandmaster`)
  - `search` *(optional)*: Case-insensitive search on name or email (e.g. `?search=ahmed`)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "source": "supabase_cloud",
  "count": 1,
  "data": [
    {
      "id": "c1f72879-1193-41bb-98a4-0c2c31e8aa14",
      "internName": "Ahmed Iqbal",
      "email": "ahmed.iqbal@decodelabs.dev",
      "tier": "Grandmaster",
      "track": "Full Stack Architecture",
      "clearanceLevel": "L3-Architect",
      "projectName": "The Responsive Architecture & Nervous System",
      "status": "Verified",
      "skills": ["HTML5 Semantics", "CSS Grid Floorplans"],
      "issuedAt": "2026-09-20T10:00:00.000Z"
    }
  ]
}
```

### 4.2 Create New Badge
- **URL:** `POST /api/badges`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "internName": "Ahmed Iqbal",
  "email": "ahmed@example.com",
  "tier": "Grandmaster",
  "track": "Full Stack Engineering",
  "skills": ["HTML5 Semantics", "CSS Grid", "REST API", "Gatekeeper"]
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Qualification Badge issued successfully.",
  "data": {
    "id": "e4a8b291-9c12-4091-bf99-52e421a11211",
    "internName": "Ahmed Iqbal",
    "email": "ahmed@example.com",
    "tier": "Grandmaster",
    "track": "Full Stack Engineering",
    "clearanceLevel": "L3-Architect",
    "projectName": "The Responsive Architecture & Nervous System",
    "status": "Verified",
    "skills": ["HTML5 Semantics", "CSS Grid", "REST API", "Gatekeeper"],
    "issuedAt": "2026-09-20T10:15:30.000Z"
  }
}
```
- **Validation Failure Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation Error",
  "details": ["A valid email address is required."]
}
```

### 4.3 Delete / Revoke Badge
- **URL:** `DELETE /api/badges/:id`
- **URL Params:** `id` (UUID string)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Badge successfully revoked and deleted.",
  "id": "e4a8b291-9c12-4091-bf99-52e421a11211"
}
```
- **Not Found Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Badge with specified ID not found."
}
```

### 4.4 System Telemetry & Health Checks
- **URL:** `GET /api/telemetry`
- **Success Response (200 OK):**
```json
{
  "status": "OPERATIONAL",
  "uptimeSeconds": 1420.5,
  "database": {
    "mode": "Supabase Cloud PostgreSQL",
    "connected": true
  },
  "memory": {
    "rssMB": 38.4,
    "heapUsedMB": 18.2
  },
  "badgeCount": 14
}
```

---

## 5. HTTP Status Code Matrix

| Code | Label | Meaning in this System |
| :--- | :--- | :--- |
| **200** | `OK` | Standard successful retrieval or deletion. |
| **201** | `Created` | Badge successfully validated, generated, and persisted in database. |
| **400** | `Bad Request` | Payload failed Gatekeeper schema validation (missing fields, bad email). |
| **404** | `Not Found` | Target badge ID does not exist in Cloud or Local storage. |
| **429** | `Too Many Requests` | Client IP exceeded request rate limit window. |
| **500** | `Internal Server Error` | Unexpected server crash; caught and masked safely by global error middleware. |
