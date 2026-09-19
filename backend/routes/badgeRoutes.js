/**
 * DecodeLabs Project 2: Qualification Badges REST Routes
 * Adheres strictly to RESTful naming: Resources are Nouns, Methods are Verbs (PDF Page 10).
 * - GET    /api/badges      -> Retrieve all
 * - GET    /api/badges/:id  -> Retrieve single
 * - POST   /api/badges      -> Create with Gatekeeper validation
 * - PUT    /api/badges/:id  -> Update
 * - DELETE /api/badges/:id  -> Delete
 */

import { Router } from 'express';
import {
  getAllBadges,
  getBadgeById,
  createBadge,
  updateBadge,
  deleteBadge
} from '../controllers/badgeController.js';
import { validateBadgePayload } from '../middleware/gatekeeper.js';

const router = Router();

router.get('/', getAllBadges);
router.get('/:id', getBadgeById);
router.post('/', validateBadgePayload, createBadge);
router.put('/:id', updateBadge);
router.delete('/:id', deleteBadge);

export default router;
