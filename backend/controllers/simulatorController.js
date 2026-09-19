/**
 * DecodeLabs Project 2: Interactive REST Sandbox & Status Simulator Controller
 * Implements Educational Verification for HTTP Status Codes & Latency (PDF Page 8, 13, 14).
 */

const STATUS_DEFINITIONS = {
  200: {
    status: 200,
    name: 'OK',
    category: '2xx Success',
    definition: 'Standard response for successful HTTP requests. The payload contains requested resource data.'
  },
  201: {
    status: 201,
    name: 'Created',
    category: '2xx Success',
    definition: 'The request has been fulfilled and resulted in a new resource being created (e.g., after POST /api/badges).'
  },
  204: {
    status: 204,
    name: 'No Content',
    category: '2xx Success',
    definition: 'The server has successfully fulfilled the request and that there is no additional content to send in the response payload.'
  },
  400: {
    status: 400,
    name: 'Bad Request',
    category: '4xx Client Error',
    definition: 'The server cannot process the request due to client error (e.g., malformed syntax, invalid JSON, or Gatekeeper validation failure).'
  },
  401: {
    status: 401,
    name: 'Unauthorized',
    category: '4xx Client Error',
    definition: 'Authentication is required and has failed or has not been provided. The client must authenticate itself.'
  },
  403: {
    status: 403,
    name: 'Forbidden',
    category: '4xx Client Error',
    definition: 'The client does not have access rights to the content, even though identity may be known (Authorization failure).'
  },
  404: {
    status: 404,
    name: 'Not Found',
    category: '4xx Client Error',
    definition: 'The server cannot find the requested resource or route pathway.'
  },
  429: {
    status: 429,
    name: 'Too Many Requests',
    category: '4xx Client Error',
    definition: 'The user has sent too many requests in a given amount of time ("Autonomic Defense" rate limiting).'
  },
  500: {
    status: 500,
    name: 'Internal Server Error',
    category: '5xx Server Error',
    definition: 'The server has encountered a situation it does not know how to handle or an unhandled exception occurred.'
  }
};

/**
 * GET /api/simulator/status/:code
 * Triggers and explains any requested HTTP status code
 */
export function simulateStatusCode(req, res) {
  const code = parseInt(req.params.code, 10);
  const info = STATUS_DEFINITIONS[code];

  if (!info) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'Invalid Status Code Requested',
      supportedCodes: Object.keys(STATUS_DEFINITIONS).map(Number),
      timestamp: new Date().toISOString()
    });
  }

  // Handle 204 No Content special case
  if (code === 204) {
    return res.status(204).end();
  }

  res.status(code).json({
    success: code >= 200 && code < 300,
    status: code,
    statusName: info.name,
    category: info.category,
    explanation: info.definition,
    curriculumRef: 'DecodeLabs Industrial Training Kit - Project 2 (Page 14)',
    timestamp: new Date().toISOString()
  });
}

/**
 * POST /api/simulator/echo
 * Demonstrates IPO Model with simulated latency
 */
export async function simulateEcho(req, res) {
  const delayMs = Math.min(3000, Math.max(0, parseInt(req.query.delay || '0', 10)));

  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  res.status(200).json({
    success: true,
    status: 200,
    message: 'IPO Signal Echo Complete',
    simulatedLatencyMs: delayMs,
    clientHeadersReceived: {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    },
    inputReceived: req.body,
    processedAt: new Date().toISOString()
  });
}

/**
 * GET /api/simulator/catalog
 * Complete OpenAPI-style pathway catalog for Developer Experience (DX)
 */
export function getApiCatalog(req, res) {
  res.status(200).json({
    success: true,
    status: 200,
    apiTitle: 'DecodeLabs Nervous System RESTful API',
    specificationVersion: '2.0.0',
    endpoints: [
      { method: 'GET', path: '/api/system/health', role: 'Telemetry health check and server uptime' },
      { method: 'GET', path: '/api/system/pulse', role: 'Real-time synaptic latency and heartbeat' },
      { method: 'GET', path: '/api/badges', role: 'List all verified qualification credentials' },
      { method: 'GET', path: '/api/badges/:id', role: 'Fetch a single verified credential by ID' },
      { method: 'POST', path: '/api/badges', role: 'Issue verified badge (Gatekeeper validated)' },
      { method: 'PUT', path: '/api/badges/:id', role: 'Update credential notes or tier' },
      { method: 'DELETE', path: '/api/badges/:id', role: 'Revoke a credential' },
      { method: 'GET', path: '/api/simulator/status/:code', role: 'Trigger and explain any HTTP status code' },
      { method: 'POST', path: '/api/simulator/echo', role: 'Echo input payload with optional ?delay=ms' }
    ],
    timestamp: new Date().toISOString()
  });
}
