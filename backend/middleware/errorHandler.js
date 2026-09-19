/**
 * DecodeLabs Project 2: Centralized Error Handler & 404 Fallback
 * Implements standard semantic status responses (PDF Page 13 & 14).
 */

export function notFoundHandler(req, res) {
  // If requesting an API endpoint that does not exist
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      status: 404,
      error: 'Not Found',
      message: `The nervous system has no pathway mapped to ${req.method} ${req.originalUrl}.`,
      suggestedPathways: [
        'GET /api/system/health',
        'GET /api/badges',
        'POST /api/badges',
        'GET /api/simulator/status/:code'
      ],
      timestamp: new Date().toISOString()
    });
  }

  // Fallback for missing static assets
  res.status(404).send('Resource not found in DecodeLabs Architecture');
}

export function globalErrorHandler(err, req, res, next) {
  console.error('[CRITICAL NERVOUS BREAKDOWN]', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unhandled internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    error: statusCode === 500 ? 'Internal Server Error' : 'Application Error',
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
}
