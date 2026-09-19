/**
 * DecodeLabs Project 2: Interactive Sandbox & Status Simulator Routes
 */

import { Router } from 'express';
import {
  simulateStatusCode,
  simulateEcho,
  getApiCatalog
} from '../controllers/simulatorController.js';

const router = Router();

router.get('/status/:code', simulateStatusCode);
router.post('/echo', simulateEcho);
router.get('/catalog', getApiCatalog);

export default router;
