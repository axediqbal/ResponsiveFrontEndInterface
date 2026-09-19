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
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const badgesFilePath = path.join(__dirname, '../data/badges.json');

// Initialize Supabase Client if environment variables exist
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
  console.log('⚡ [DATABASE] Supabase Cloud PostgreSQL Connected!');
} else {
  console.log('💾 [DATABASE] Running in Local Mode — using local JSON persistence vault.');
}

// Normalizer for Supabase snake_case <-> camelCase
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

// Helper to read local database
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

// Helper to write local database
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
export async function getAllBadges(req, res) {
  const { tier, search } = req.query;

  // 1. Try Supabase Cloud Database if configured
  if (supabase) {
    try {
      let query = supabase.from('badges').select('*').order('issued_at', { ascending: false });
      if (tier) query = query.ilike('tier', tier);

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        let filtered = data.map(normalizeBadge);
        if (search) {
          const term = search.toLowerCase();
          filtered = filtered.filter(b => 
            b.internName.toLowerCase().includes(term) || 
            b.id.toLowerCase().includes(term)
          );
        }
        return res.status(200).json({
          success: true,
          status: 200,
          provider: 'supabase-cloud',
          count: filtered.length,
          totalInVault: data.length,
          data: filtered,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local vault:', err.message);
    }
  }

  // 2. Fallback to Local JSON Vault
  const badges = readBadges();
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
    provider: 'local-vault',
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
export async function getBadgeById(req, res) {
  const { id } = req.params;

  // 1. Try Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .ilike('id', id)
        .single();

      if (!error && data) {
        return res.status(200).json({
          success: true,
          status: 200,
          provider: 'supabase-cloud',
          data: normalizeBadge(data),
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Supabase single fetch warning:', err.message);
    }
  }

  // 2. Fallback to Local JSON
  const badges = readBadges();
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
    provider: 'local-vault',
    data: found,
    timestamp: new Date().toISOString()
  });
}

/**
 * POST /api/badges
 * Create and persist a new qualification credential
 */
export async function createBadge(req, res) {
  const { internName, tier, skills, email, clearanceLevel } = req.sanitizedBody || req.body;
  const badges = readBadges();

  // Generate cryptographically secure credential ID
  const hash = crypto.randomBytes(3).toString('hex').toUpperCase();
  const newCredentialId = `DL-2026-WK1-${hash}`;
  const now = new Date().toISOString();

  const assignedSkills = Array.isArray(skills) && skills.length > 0 ? skills : [
    'HTML5 Semantics',
    'CSS Grid Floorplans',
    'REST API Integration',
    'Gatekeeper Validation'
  ];

  const newBadge = {
    id: newCredentialId,
    internName,
    email: email || `${internName.toLowerCase().replace(/\s+/g, '')}@decodelabs.dev`,
    tier: tier || 'Novice',
    clearanceLevel: clearanceLevel || 'L1-Operator',
    projectName: 'The Responsive Architecture & Nervous System',
    status: 'Verified',
    issuedAt: now,
    skills: assignedSkills
  };

  // 1. Persist to Supabase if connected
  let savedToCloud = false;
  if (supabase) {
    try {
      const basePayload = {
        id: newCredentialId,
        intern_name: internName,
        email: newBadge.email,
        tier: newBadge.tier,
        track: newBadge.projectName,
        clearance_level: newBadge.clearanceLevel,
        verification_code: hash,
        issued_at: now
      };

      // Try inserting with skills column first
      let { error } = await supabase.from('badges').insert([{
        ...basePayload,
        skills: JSON.stringify(assignedSkills)
      }]);

      // If skills column is not in the schema, retry without it seamlessly
      if (error && error.message && error.message.includes('skills')) {
        const retry = await supabase.from('badges').insert([basePayload]);
        error = retry.error;
      }

      if (!error) {
        savedToCloud = true;
        console.log('✅ [SUPABASE] Badge inserted successfully to cloud table:', newCredentialId);
      } else {
        console.error('❌ [SUPABASE INSERT ERROR]:', error.message || error);
      }
    } catch (err) {
      console.warn('Supabase insert exception:', err.message);
    }
  }

  // 2. Always maintain local shadow copy
  badges.unshift(newBadge);
  writeBadges(badges);

  // Set Location header according to REST best practice
  res.setHeader('Location', `/api/badges/${newCredentialId}`);

  // Return HTTP 201 Created
  res.status(201).json({
    success: true,
    status: 201,
    provider: savedToCloud ? 'supabase-cloud' : 'local-vault',
    message: `Qualification credential successfully issued for ${internName}! 🛡️`,
    data: newBadge,
    timestamp: now
  });
}

/**
 * PUT /api/badges/:id
 * Update an existing credential badge
 */
export async function updateBadge(req, res) {
  const { id } = req.params;
  const { tier, skills, notes, internName } = req.body;
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

  // Update fields
  if (internName) badges[index].internName = internName;
  if (tier) badges[index].tier = tier;
  if (Array.isArray(skills)) badges[index].skills = skills;
  if (notes) badges[index].notes = notes;
  badges[index].updatedAt = new Date().toISOString();

  // Supabase update if available
  if (supabase) {
    try {
      await supabase.from('badges').update({
        intern_name: badges[index].internName,
        tier: badges[index].tier,
        skills: JSON.stringify(badges[index].skills)
      }).ilike('id', id);
    } catch (err) {
      console.warn('Supabase update warning:', err.message);
    }
  }

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
export async function deleteBadge(req, res) {
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

  // Supabase delete if available
  if (supabase) {
    try {
      await supabase.from('badges').delete().ilike('id', id);
    } catch (err) {
      console.warn('Supabase delete warning:', err.message);
    }
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
