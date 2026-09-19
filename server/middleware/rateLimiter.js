/**
 * DecodeLabs Project 2: Autonomic Defense - Rate Limiter
 * Implements HTTP 429 Too Many Requests defense mechanism (PDF Page 14 & 15).
 */

const requestBuckets = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 100;    // 100 requests per minute per IP

export function autonomicRateLimiter(req, res, next) {
  // Allow bypassing rate limit for static files
  if (!req.path.startsWith('/api')) {
    return next();
  }

  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  let clientData = requestBuckets.get(clientIp);
  if (!clientData || (now - clientData.startTime) > WINDOW_MS) {
    clientData = {
      startTime: now,
      count: 1
    };
    requestBuckets.set(clientIp, clientData);
  } else {
    clientData.count++;
  }

  const remaining = Math.max(0, MAX_REQUESTS - clientData.count);
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', remaining);

  if (clientData.count > MAX_REQUESTS) {
    const retrySecs = Math.ceil((WINDOW_MS - (now - clientData.startTime)) / 1000);
    res.setHeader('Retry-After', retrySecs);

    return res.status(429).json({
      success: false,
      status: 429,
      error: 'Too Many Requests',
      message: 'Autonomic Defense triggered: Rate limit exceeded. Please back off and retry.',
      retryAfterSeconds: retrySecs,
      timestamp: new Date().toISOString()
    });
  }

  next();
}
