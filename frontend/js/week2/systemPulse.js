/**
 * DecodeLabs Project 2: Real-time System Pulse & Health Telemetry
 * Visualizes the IPO Model and System Vitals (PDF Page 7 & 18: Beyond CRUD).
 */

export function initSystemPulse() {
  const pulseStatusEl = document.getElementById('pulse-status-text');
  const latencyBadgeEl = document.getElementById('pulse-latency-badge');
  const uptimeEl = document.getElementById('pulse-uptime-text');
  const totalBadgesEl = document.getElementById('pulse-badges-text');
  const ecgCanvas = document.getElementById('ecg-canvas');

  if (!pulseStatusEl && !ecgCanvas) return;

  // Draw ECG Canvas
  let ctx = null;
  let points = [];
  const maxPoints = 80;

  if (ecgCanvas) {
    ctx = ecgCanvas.getContext('2d');
    for (let i = 0; i < maxPoints; i++) {
      points.push(50);
    }

    const resizeCanvas = () => {
      if (ecgCanvas.parentElement) {
        ecgCanvas.width = ecgCanvas.parentElement.clientWidth;
        ecgCanvas.height = ecgCanvas.parentElement.clientHeight || 70;
        renderEcg();
      }
    };
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('orientationchange', resizeCanvas, { passive: true });
    setTimeout(resizeCanvas, 50);
  }

  function fetchHealth() {
    fetch('/api/system/health')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.telemetry) {
          if (uptimeEl) uptimeEl.textContent = data.telemetry.uptimeFormatted;
          if (totalBadgesEl) totalBadgesEl.textContent = data.telemetry.verifiedBadgesPersisted;
          if (pulseStatusEl) {
            pulseStatusEl.innerHTML = '<span class="status-dot" style="background:#10b981;"></span> Online (Optimal)';
          }
        }
      })
      .catch(() => {
        if (pulseStatusEl) {
          pulseStatusEl.innerHTML = '<span class="status-dot" style="background:#ef4444;"></span> Synapse Severed (Offline)';
        }
      });
  }

  function fetchPulse() {
    const startTime = performance.now();
    fetch('/api/system/pulse')
      .then(res => res.json())
      .then(data => {
        const roundTripMs = (performance.now() - startTime).toFixed(1);
        if (latencyBadgeEl) {
          latencyBadgeEl.textContent = `${roundTripMs} ms`;
          latencyBadgeEl.className = 'glass-pill ' + (roundTripMs < 50 ? 'glass-pill-ethereal' : 'glass-pill-mocha');
        }

        // Add ECG spike
        addEcgSpike();
      })
      .catch(() => {
        if (latencyBadgeEl) {
          latencyBadgeEl.textContent = 'Timeout';
          latencyBadgeEl.className = 'glass-pill glass-pill-danger';
        }
      });
  }

  function addEcgSpike() {
    if (!ctx || !ecgCanvas) return;
    // Push heartbeat pattern: [baseline, slight dip, tall spike, deep drop, bump, baseline]
    points.push(50, 47, 18, 85, 42, 50);
    while (points.length > maxPoints) {
      points.shift();
    }
    renderEcg();
  }

  function renderEcg() {
    if (!ctx || !ecgCanvas) return;
    const w = ecgCanvas.width;
    const h = ecgCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle grid background
    ctx.strokeStyle = 'rgba(160, 212, 224, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Pulse Line
    ctx.beginPath();
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#34d399';

    const step = w / (maxPoints - 1);
    for (let i = 0; i < points.length; i++) {
      const x = i * step;
      const y = (points[i] / 100) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Baseline heartbeat ticks
  setInterval(() => {
    if (points.length >= maxPoints) {
      points.push(50 + (Math.random() * 4 - 2));
      points.shift();
      renderEcg();
    }
  }, 100);

  // Initial fetch and poll
  fetchHealth();
  fetchPulse();
  setInterval(fetchPulse, 4000);
  setInterval(fetchHealth, 10000);
}
