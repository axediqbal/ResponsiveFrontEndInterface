/**
 * DecodeLabs Project 2: System Health & Vitals Routes
 * REST Naming: Resource is a Noun (/system/health, /system/pulse)
 */

import { Router } from 'express';
import { getSystemHealth, getSystemPulse } from '../controllers/systemController.js';

const router = Router();

router.get('/health', getSystemHealth);
router.get('/pulse', getSystemPulse);

export default router;
