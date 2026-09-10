/**
 * DecodeLabs Project 1: Qualification Badge & Certificate Generator
 * Fulfills Qualification Criteria (Page 3 PDF)
 */

export function initBadge() {
  const nameInput = document.getElementById('intern-name-input');
  const badgeNameDisplay = document.getElementById('badge-name-display');
  const badgeTierSelect = document.getElementById('badge-tier-select');
  const badgeTierDisplay = document.getElementById('badge-tier-display');
  const badgeIdDisplay = document.getElementById('badge-id-display');
  const badgeDateDisplay = document.getElementById('badge-date-display');
  const copyBadgeBtn = document.getElementById('btn-copy-badge');
  const downloadBadgeBtn = document.getElementById('btn-download-badge');

  // Set today's date formatted
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (badgeDateDisplay) {
    badgeDateDisplay.textContent = dateStr;
  }

  // Generate unique credential verification ID
  const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
  const credentialId = `DL-2026-WK1-${randomHash}`;
  if (badgeIdDisplay) {
    badgeIdDisplay.textContent = credentialId;
  }

  if (nameInput && badgeNameDisplay) {
    nameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      badgeNameDisplay.textContent = val ? val : 'Full Stack Intern';
    });
  }

  if (badgeTierSelect && badgeTierDisplay) {
    badgeTierSelect.addEventListener('change', (e) => {
      badgeTierDisplay.textContent = e.target.value;
    });
  }

  if (copyBadgeBtn) {
    copyBadgeBtn.addEventListener('click', () => {
      const currentName = badgeNameDisplay ? badgeNameDisplay.textContent : 'Intern';
      const textToCopy = `DecodeLabs Qualification Verified: ${currentName} has completed Project 1: Responsive Architecture. Credential ID: ${credentialId}`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const event = new CustomEvent('app:toast', {
          detail: { message: 'Credential verification copied to clipboard! 📋' }
        });
        window.dispatchEvent(event);
      });
    });
  }

  if (downloadBadgeBtn) {
    downloadBadgeBtn.addEventListener('click', () => {
      const currentName = badgeNameDisplay ? badgeNameDisplay.textContent : 'Intern';
      const event = new CustomEvent('app:toast', {
        detail: { message: `Generating verified credential for ${currentName}... 🚀` }
      });
      window.dispatchEvent(event);
    });
  }
}
