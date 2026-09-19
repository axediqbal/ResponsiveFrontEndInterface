/**
 * DecodeLabs Project 1 & 2: Qualification Badge & Persistent Credential Ledger
 * Connects Frontend Client to Backend Gatekeeper API (POST /api/badges & GET /api/badges).
 */

export function initBadge() {
  const nameInput = document.getElementById('intern-name-input');
  const badgeNameDisplay = document.getElementById('badge-name-display');
  const badgeTierSelect = document.getElementById('badge-tier-select');
  const badgeTierDisplay = document.getElementById('badge-tier-display');
  const badgeIdDisplay = document.getElementById('badge-id-display');
  const badgeDateDisplay = document.getElementById('badge-date-display');
  const saveBadgeBtn = document.getElementById('btn-download-badge');
  const copyBadgeBtn = document.getElementById('btn-copy-badge');
  const verifiedListContainer = document.getElementById('verified-interns-list');

  // Set today's date formatted
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (badgeDateDisplay) badgeDateDisplay.textContent = dateStr;

  // Real-time name sync
  if (nameInput && badgeNameDisplay) {
    nameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      badgeNameDisplay.textContent = val ? val : 'Full Stack Intern';
    });
  }

  // Real-time tier sync
  if (badgeTierSelect && badgeTierDisplay) {
    badgeTierSelect.addEventListener('change', (e) => {
      badgeTierDisplay.textContent = e.target.value;
    });
  }

  // Load verified badges from Backend API (GET /api/badges)
  function loadVerifiedBadges() {
    if (!verifiedListContainer) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    fetch('/api/badges', {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    })
      .then(async res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(result => {
        if (!result.success || !Array.isArray(result.data)) return;
        
        verifiedListContainer.innerHTML = '';
        if (result.data.length === 0) {
          verifiedListContainer.innerHTML = '<p style="color:var(--color-mocha-300); font-size:13px; padding:8px 0;">No credentials registered yet. Click "Claim Credential" above to create one! 🛡️</p>';
          return;
        }

        result.data.forEach(badge => {
          const item = document.createElement('div');
          item.className = 'glass-card verified-badge-card';
          item.style.padding = '10px 14px';
          item.style.marginBottom = '8px';
          item.style.display = 'flex';
          item.style.justifyContent = 'space-between';
          item.style.alignItems = 'center';
          item.style.flexWrap = 'wrap';
          item.style.gap = '8px';
          item.style.fontSize = '13px';

          const name = badge.internName || badge.intern_name || 'Verified Intern';
          const tier = badge.tier || 'Gold';
          const id = badge.id || 'DL-2026';
          const rawDate = badge.issuedAt || badge.issued_at;
          const displayDate = rawDate ? new Date(rawDate).toLocaleDateString() : new Date().toLocaleDateString();

          const tierLower = tier.toLowerCase();
          const tierColor = tierLower.includes('plat') ? '#c084fc' :
                            tierLower.includes('gold') ? '#fbbf24' :
                            tierLower.includes('silver') ? '#94a3b8' :
                            tierLower.includes('architect') ? '#38bdf8' : '#34d399';

          item.innerHTML = `
            <div>
              <strong style="color:var(--color-ethereal-300); font-size:14px;">${name}</strong>
              <div style="color:rgba(255,255,255,0.5); font-family:var(--font-mono); font-size:11px;">${id} • ${displayDate}</div>
            </div>
            <span class="glass-pill" style="border-color:${tierColor}; color:${tierColor}; font-weight:700;">
              ${tier}
            </span>
          `;
          verifiedListContainer.appendChild(item);
        });
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.warn('Could not fetch badges from server:', err);
      });
  }

  // Initial load & listen for global badge updates
  loadVerifiedBadges();
  window.addEventListener('badges:updated', loadVerifiedBadges);

  // POST /api/badges to save verified credential to backend
  if (saveBadgeBtn) {
    saveBadgeBtn.addEventListener('click', async () => {
      const internName = (nameInput ? nameInput.value : '').trim() || (badgeNameDisplay ? badgeNameDisplay.textContent : '');
      const tier = badgeTierSelect ? badgeTierSelect.value : 'Gold';

      saveBadgeBtn.disabled = true;
      saveBadgeBtn.textContent = 'Verifying with Gatekeeper... 🛡️';

      // 6-second watchdog timeout so the button is NEVER permanently stuck
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 6000);

      try {
        const response = await fetch('/api/badges', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            internName,
            tier,
            skills: ['HTML5 Semantics', 'CSS Grid', 'RESTful API', 'Gatekeeper Validation']
          })
        });

        clearTimeout(timeoutId);

        let data = {};
        const rawText = await response.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          throw new Error(`Server returned unexpected response (${response.status})`);
        }

        if (response.status === 201) {
          if (badgeIdDisplay && data.data) {
            badgeIdDisplay.textContent = data.data.id;
          }
          const providerText = data.provider === 'supabase-cloud' ? ' ☁️ [Supabase Cloud]' : ' 💾 [Local Vault]';
          const event = new CustomEvent('app:toast', {
            detail: { message: `✅ Credential Verified & Persisted! (ID: ${data.data?.id || 'DL-2026'})${providerText}` }
          });
          window.dispatchEvent(event);
          loadVerifiedBadges();
          window.dispatchEvent(new CustomEvent('badges:updated'));
        } else {
          // Gatekeeper validation error
          const errMsg = data.details ? data.details.map(d => d.message).join(' | ') : (data.message || `Validation error (${response.status})`);
          const event = new CustomEvent('app:toast', {
            detail: { message: `❌ Gatekeeper Rejection: ${errMsg}` }
          });
          window.dispatchEvent(event);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        const isTimeout = err.name === 'AbortError';
        const msg = isTimeout 
          ? '⏱️ Request timed out after 6s. Please retry.' 
          : `⚠️ Connection Error: ${err.message}`;
        const event = new CustomEvent('app:toast', {
          detail: { message: msg }
        });
        window.dispatchEvent(event);
      } finally {
        clearTimeout(timeoutId);
        saveBadgeBtn.disabled = false;
        saveBadgeBtn.textContent = 'Claim Credential';
      }
    });
  }

  // Copy badge ID & share text
  if (copyBadgeBtn) {
    copyBadgeBtn.addEventListener('click', () => {
      const currentName = badgeNameDisplay ? badgeNameDisplay.textContent : 'Intern';
      const id = badgeIdDisplay ? badgeIdDisplay.textContent : 'DL-2026-WK1-SAMPLE';
      const baseUrl = window.location.origin;
      const textToCopy = `DecodeLabs Verified Credential: ${currentName} completed Projects 1 & 2 (Responsive Architecture + Backend API). Verification ID: ${id} | URL: ${baseUrl}/api/badges/${id}`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const event = new CustomEvent('app:toast', {
          detail: { message: 'Verification link & ID copied to clipboard! 📋' }
        });
        window.dispatchEvent(event);
      });
    });
  }
}
