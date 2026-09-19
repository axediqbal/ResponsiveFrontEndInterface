/**
 * DecodeLabs Project 2: System Health & Telemetry Controller
 * Implements "The Pulse of the System: IPO Model" & "Beyond CRUD: Vital Signs"
 * (PDF Page 7 & 18).
 */

import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const badgesFilePath = path.join(__dirname, '../data/badges.json');

const serverStartTime = Date.now();
let requestCounter = 0;

export function getSystemHealth(req, res) {
  requestCounter++;
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  const memUsage = process.memoryUsage();

  let totalBadgesCount = 0;
  try {
    if (fs.existsSync(badgesFilePath)) {
      const data = JSON.parse(fs.readFileSync(badgesFilePath, 'utf8'));
      totalBadgesCount = Array.isArray(data) ? data.length : 0;
    }
  } catch (e) {
    totalBadgesCount = 0;
  }

  // System Vitals adhering to RESTful IPO output
  res.status(200).json({
    success: true,
    status: 200,
    system: {
      name: 'DecodeLabs Nervous System API Engine',
      version: '2.0.0-2026',
      architectureStatus: 'Optimal (Synaptic Bridge Operational)',
      environment: process.env.NODE_ENV || 'production',
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch()
    },
    telemetry: {
      uptimeSeconds,
      uptimeFormatted: formatUptime(uptimeSeconds),
      totalRequestsProcessed: requestCounter,
      verifiedBadgesPersisted: totalBadgesCount,
      memoryHeapUsedMB: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
      memoryRssMB: (memUsage.rss / 1024 / 1024).toFixed(2),
      cpuCores: os.cpus().length
    },
    timestamp: new Date().toISOString()
  });
}

export function getSystemPulse(req, res) {
  // Returns instant pulse diagnostics for real-time visualizer
  const simulatedHeartbeatRate = Math.floor(60 + Math.random() * 15); // 60-75 bpm
  const randomLatencyJitter = +(Math.random() * 4 + 1.2).toFixed(2); // 1.2 - 5.2 ms

  res.status(200).json({
    success: true,
    status: 200,
    pulse: {
      state: 'STABLE',
      heartbeatBpm: simulatedHeartbeatRate,
      synapticLatencyMs: randomLatencyJitter,
      throughput: '5.2 GB/s',
      bloodBrainBarrier: 'Active',
      timestamp: Date.now()
    }
  });
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
