/**
 * DecodeLabs Industrial Training Program — Full Stack Track
 * Project 2: The Nervous System (Backend API Engine)
 * Bridges the Frontend (Project 1: The Skin) with a RESTful Engine.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Middlewares
import { telemetryLogger } from './middleware/logger.js';
import { autonomicRateLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

// Routers
import systemRoutes from './routes/systemRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import simulatorRoutes from './routes/simulatorRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '../frontend');

const app = express();
const PORT = process.env.PORT || 5500;

// 1. Security & Core Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. Telemetry & Autonomic Defense
app.use(telemetryLogger);
app.use(autonomicRateLimiter);

// 3. Serve Frontend Static Assets (The Skin)
app.use(express.static(frontendDir));

// 4. REST API Endpoints (The Nervous System)
app.use('/api/system', systemRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/simulator', simulatorRoutes);

// 5. Fallback & Error Boundaries
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 6. Bootstrap Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('⚡ \x1b[36mDecodeLabs Industrial Training Engine\x1b[0m — Batch 2026');
    console.log('🧠 \x1b[32mProject 2: The Nervous System (RESTful API) ACTIVE\x1b[0m');
    console.log('🌐 Local URL:      \x1b[34mhttp://localhost:' + PORT + '\x1b[0m');
    console.log('🩺 Health API:     \x1b[34mhttp://localhost:' + PORT + '/api/system/health\x1b[0m');
    console.log('🛡️ Badges API:     \x1b[34mhttp://localhost:' + PORT + '/api/badges\x1b[0m');
    console.log('🧪 API Catalog:    \x1b[34mhttp://localhost:' + PORT + '/api/simulator/catalog\x1b[0m');
    console.log('='.repeat(60) + '\n');
  });
}

export default app;
