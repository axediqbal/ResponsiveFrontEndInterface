/**
 * DecodeLabs Project 2: Qualification Badges REST Controller
 * Demonstrates CRUD with RESTful Naming & HTTP Methods:
 * - GET: Retrieval (Safe, Idempotent) -> 200 OK
 * - POST: Creation (Unsafe, Non-idempotent) -> 201 Created
 * - PUT: Replacement/Update -> 200 OK
 * - DELETE: Removal -> 200 OK / 204 No Content
 * (PDF Page 9 & 10)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const badgesFilePath = path.join(__dirname, '../data/badges.json');

// Helper to read database
function readBadges() {
  try {
    if (!fs.existsSync(badgesFilePath)) {
      fs.writeFileSync(badgesFilePath, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(badgesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading badges database:', error);
    return [];
  }
}

// Helper to write database
function writeBadges(badges) {
  try {
    fs.writeFileSync(badgesFilePath, JSON.stringify(badges, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing badges database:', error);
  }
}

/**
 * GET /api/badges
 * List all badges with optional filtering
 */
export function getAllBadges(req, res) {
  const badges = readBadges();
  const { tier, search } = req.query;

  let filtered = [...badges];

  if (tier) {
    filtered = filtered.filter(b => b.tier.toLowerCase() === tier.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(b => 
      b.internName.toLowerCase().includes(term) || 
      b.id.toLowerCase().includes(term)
    );
  }

  res.status(200).json({
    success: true,
    status: 200,
    count: filtered.length,
    totalInVault: badges.length,
    data: filtered,
    timestamp: new Date().toISOString()
  });
}

/**
 * GET /api/badges/:id
 * Retrieve a specific badge by credential ID
 */
export function getBadgeById(req, res) {
  const badges = readBadges();
  const { id } = req.params;

  const found = badges.find(b => b.id.toUpperCase() === id.toUpperCase());

  if (!found) {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'Not Found',
      message: `No qualification credential exists with ID: "${id}".`,
      timestamp: new Date().toISOString()
    });
  }

  res.status(200).json({
    success: true,
    status: 200,
    data: found,
    timestamp: new Date().toISOString()
  });
}

/**
 * POST /api/badges
 * Create and persist a new qualification credential
 * Syntactic & semantic checks passed via gatekeeper middleware
 */
export function createBadge(req, res) {
  const { internName, tier, skills } = req.sanitizedBody;
  const badges = readBadges();

  // Generate cryptographically secure credential ID
  const hash = crypto.randomBytes(3).toString('hex').toUpperCase();
  const newCredentialId = `DL-2026-WK1-${hash}`;

  const newBadge = {
    id: newCredentialId,
    internName,
    tier,
    projectName: 'The Responsive Architecture & Nervous System',
    status: 'Verified',
    issuedAt: new Date().toISOString(),
    skills: skills.length > 0 ? skills : [
      'HTML5 Semantics',
      'CSS Grid Floorplans',
      'REST API Integration',
      'Gatekeeper Validation'
    ]
  };

  badges.unshift(newBadge); // Insert at beginning
  writeBadges(badges);

  // Set Location header according to REST best practice
  res.setHeader('Location', `/api/badges/${newCredentialId}`);

  // Return HTTP 201 Created
  res.status(201).json({
    success: true,
    status: 201,
    message: `Qualification credential successfully issued for ${internName}! 🛡️`,
    data: newBadge,
    timestamp: new Date().toISOString()
  });
}

/**
 * PUT /api/badges/:id
 * Update an existing credential badge
 */
export function updateBadge(req, res) {
  const { id } = req.params;
  const { tier, skills, notes } = req.body;
  const badges = readBadges();

  const index = badges.findIndex(b => b.id.toUpperCase() === id.toUpperCase());
  if (index === -1) {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'Not Found',
      message: `Cannot update credential: Badge with ID "${id}" was not found.`,
      timestamp: new Date().toISOString()
    });
  }

  // Update fields if provided
  if (tier) badges[index].tier = tier;
  if (Array.isArray(skills)) badges[index].skills = skills;
  if (notes) badges[index].notes = notes;
  badges[index].updatedAt = new Date().toISOString();

  writeBadges(badges);

  res.status(200).json({
    success: true,
    status: 200,
    message: `Credential ${id} updated successfully.`,
    data: badges[index],
    timestamp: new Date().toISOString()
  });
}

/**
 * DELETE /api/badges/:id
 * Revoke a credential badge
 */
export function deleteBadge(req, res) {
  const { id } = req.params;
  const badges = readBadges();

  const index = badges.findIndex(b => b.id.toUpperCase() === id.toUpperCase());
  if (index === -1) {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'Not Found',
      message: `Cannot revoke credential: Badge with ID "${id}" was not found.`,
      timestamp: new Date().toISOString()
    });
  }

  const removed = badges.splice(index, 1)[0];
  writeBadges(badges);

  res.status(200).json({
    success: true,
    status: 200,
    message: `Credential ${id} for ${removed.internName} has been revoked.`,
    revokedCredential: removed,
    timestamp: new Date().toISOString()
  });
}
