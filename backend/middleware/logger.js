/**
 * DecodeLabs Project 2: Signal Telemetry & Latency Logger
 * Tracks request lifecycle, latency (ms), and status codes.
 * Reflects "The Paradigm Shift: Latency Critical Path" (PDF Page 6 & 8).
 */

export function telemetryLogger(req, res, next) {
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString();

  // Hook into writeHead so X-Response-Time header is sent before headers finalize
  const originalWriteHead = res.writeHead;
  res.writeHead = function (...args) {
    const diff = process.hrtime(startTime);
    const latencyMs = ((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(2);
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${latencyMs}ms`);
    }
    return originalWriteHead.apply(res, args);
  };

  // Intercept response finish for console signal logging
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const latencyMs = ((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(2);

    const statusColor = res.statusCode >= 500 ? '\x1b[31m' : // Red
                        res.statusCode >= 400 ? '\x1b[33m' : // Yellow
                        res.statusCode >= 300 ? '\x1b[36m' : // Cyan
                        '\x1b[32m';                          // Green
    const resetColor = '\x1b[0m';

    console.log(
      `[${timestamp}] \x1b[35m${req.method}\x1b[0m ${req.originalUrl} -> ` +
      `${statusColor}${res.statusCode}${resetColor} (${latencyMs}ms)`
    );
  });

  next();
}
