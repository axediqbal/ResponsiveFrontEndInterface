/**
 * DecodeLabs Project 2: Interactive REST API Console
 * Allows interns to test GET, POST, PUT, DELETE endpoints live in browser.
 */

export function initApiConsole() {
  const methodSelect = document.getElementById('api-method-select');
  const endpointSelect = document.getElementById('api-endpoint-select');
  const customPathInput = document.getElementById('api-custom-path');
  const payloadEditor = document.getElementById('api-payload-editor');
  const sendBtn = document.getElementById('btn-send-request');
  const responseStatusEl = document.getElementById('api-response-status');
  const responseLatencyEl = document.getElementById('api-response-latency');
  const responseViewerEl = document.getElementById('api-response-viewer');

  if (!sendBtn || !endpointSelect) return;

  const samplePayloads = {
    'POST /api/badges': JSON.stringify({
      internName: 'Ahmed Iqbal',
      tier: 'Platinum',
      skills: ['HTML5 Semantics', 'CSS Grid', 'REST API Architecture', 'Gatekeeper Validation']
    }, null, 2),
    'POST /api/simulator/echo': JSON.stringify({
      message: 'Testing IPO Model data transmission',
      timestamp: new Date().toISOString()
    }, null, 2),
    'PUT /api/badges/DL-2026-WK1-A9F32B': JSON.stringify({
      tier: 'Platinum',
      notes: 'Completed both Week 1 and Week 2 milestones with honors.'
    }, null, 2)
  };

  // Preset switch
  endpointSelect.addEventListener('change', () => {
    const [method, path] = endpointSelect.value.split(' ');
    if (methodSelect) methodSelect.value = method;
    if (customPathInput) customPathInput.value = path;

    const presetKey = `${method} ${path}`;
    if (payloadEditor) {
      payloadEditor.value = samplePayloads[presetKey] || '';
    }
  });

  // Execute request
  sendBtn.addEventListener('click', async () => {
    const method = methodSelect ? methodSelect.value : 'GET';
    const path = customPathInput ? customPathInput.value.trim() : '/api/system/health';
    
    sendBtn.disabled = true;
    sendBtn.textContent = 'Transmitting... ⚡';
    if (responseStatusEl) responseStatusEl.textContent = 'Pending...';
    if (responseLatencyEl) responseLatencyEl.textContent = '...';
    if (responseViewerEl) responseViewerEl.textContent = 'Awaiting response from nervous system...';

    const startTime = performance.now();

    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && payloadEditor && payloadEditor.value.trim()) {
        try {
          JSON.parse(payloadEditor.value); // Syntactic check before send
          options.body = payloadEditor.value.trim();
        } catch (err) {
          throw new Error(`JSON Syntax Error in Request Body: ${err.message}`);
        }
      }

      const res = await fetch(path, options);
      const latencyMs = (performance.now() - startTime).toFixed(1);

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }

      // Update badges
      if (responseStatusEl) {
        responseStatusEl.textContent = `${res.status} ${res.statusText || ''}`;
        responseStatusEl.className = 'status-code-pill ' + 
          (res.status < 300 ? 'status-2xx' : res.status < 500 ? 'status-4xx' : 'status-5xx');
      }

      if (responseLatencyEl) {
        responseLatencyEl.textContent = `${latencyMs} ms`;
      }

      if (responseViewerEl) {
        responseViewerEl.textContent = typeof data === 'object' 
          ? JSON.stringify(data, null, 2) 
          : data;
      }

      // Dispatch event to refresh badge list if a badge was created/deleted
      if (path.startsWith('/api/badges') && ['POST', 'PUT', 'DELETE'].includes(method)) {
        window.dispatchEvent(new CustomEvent('badges:updated'));
      }

    } catch (error) {
      const latencyMs = (performance.now() - startTime).toFixed(1);
      if (responseStatusEl) {
        responseStatusEl.textContent = 'Error';
        responseStatusEl.className = 'status-code-pill status-5xx';
      }
      if (responseLatencyEl) responseLatencyEl.textContent = `${latencyMs} ms`;
      if (responseViewerEl) responseViewerEl.textContent = error.message;
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Dispatch Request 🚀';
    }
  });
}
