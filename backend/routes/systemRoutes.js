/**
 * DecodeLabs Project 2: System Health & Vitals Routes
 * REST Naming: Resource is a Noun (/system/health, /system/pulse)
 */

import { Router } from 'express';
import { getSystemHealth, getSystemPulse, getDatabaseStatus } from '../controllers/systemController.js';

const router = Router();

router.get('/health', getSystemHealth);
router.get('/pulse', getSystemPulse);
router.get('/db-status', getDatabaseStatus);

export default router;
