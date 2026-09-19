/**
 * DecodeLabs Project 2: The Gatekeeper Rule ("Never Trust the Client")
 * Implements the Blood-Brain Barrier (PDF Page 11):
 * 1. Syntactic Validation: Data types, required fields, and structural format.
 * 2. Semantic Validation: Logical coherence and business domain constraints.
 */

const VALID_TIERS = [
  'Bronze', 'Silver', 'Gold', 'Platinum',
  'Full Stack Architect (Level 1)',
  'Frontend Craft Specialist',
  'UI/UX Responsive Master',
  'Platinum • Full Stack Architect (Level 1)',
  'Gold • Frontend Craft Specialist',
  'Silver • UI/UX Responsive Master',
  'Bronze • Apprentice Operative'
];

/**
 * Gatekeeper validator for Qualification Badge submissions (POST / PUT)
 */
export function validateBadgePayload(req, res, next) {
  const { internName, tier, skills } = req.body;
  const errors = [];

  // 1. Syntactic Validation: Is the format correct?
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'Bad Request',
      message: 'Gatekeeper rejection: Request body must be a valid JSON object.',
      timestamp: new Date().toISOString()
    });
  }

  if (!internName || typeof internName !== 'string') {
    errors.push({
      field: 'internName',
      type: 'SyntacticError',
      message: 'Field "internName" is mandatory and must be a string.'
    });
  } else if (internName.trim().length < 3) {
    // Semantic Validation: Is the logic valid?
    errors.push({
      field: 'internName',
      type: 'SemanticError',
      message: 'Intern name must contain at least 3 non-whitespace characters.'
    });
  } else if (internName.length > 50) {
    errors.push({
      field: 'internName',
      type: 'SemanticError',
      message: 'Intern name must not exceed 50 characters.'
    });
  }

  if (tier !== undefined) {
    if (typeof tier !== 'string') {
      errors.push({
        field: 'tier',
        type: 'SyntacticError',
        message: 'Field "tier" must be a string if provided.'
      });
    } else {
      const isPermitted = VALID_TIERS.some(t => t.toLowerCase() === tier.toLowerCase());
      if (!isPermitted) {
        errors.push({
          field: 'tier',
          type: 'SemanticError',
          message: `Invalid qualification tier "${tier}". Permitted tiers: ${VALID_TIERS.slice(0, 4).join(', ')} or specialization tracks.`
        });
      }
    }
  }

  if (skills !== undefined && !Array.isArray(skills)) {
    errors.push({
      field: 'skills',
      type: 'SyntacticError',
      message: 'Field "skills" must be an array of strings.'
    });
  }

  // If any syntactic or semantic pathogens were detected, reject with HTTP 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'Bad Request',
      gatekeeperCheck: 'Failed - Blood-Brain Barrier Rejection',
      message: 'Validation failed. Client input violates syntactic or semantic rules.',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  // Sanitize valid inputs
  req.sanitizedBody = {
    internName: internName.trim(),
    tier: tier || 'Gold',
    skills: Array.isArray(skills) ? skills.map(s => String(s).trim()).filter(Boolean) : []
  };

  next();
}
