/**
 * DecodeLabs Retro-Futurist Typewriter & Action Pill Controller
 */

export function initHeroTypewriter() {
  const typewriterEl = document.getElementById('hero-typewriter-text');
  const cursorEl = document.getElementById('hero-typewriter-cursor');
  const pillsContainer = document.getElementById('hero-action-pills');
  const copyContactBtn = document.getElementById('btn-copy-contact');

  const textToType =
    "Glad you stopped in. Good taste tends to find us. Welcome to DecodeLabs — now, what are we building?";
  const speed = 35;
  const startDelay = 500;

  // 1. Reveal Action Pills after 400ms
  if (pillsContainer) {
    setTimeout(() => {
      pillsContainer.style.opacity = '1';
      pillsContainer.style.transform = 'translateY(0)';
    }, 400);
  }

  // 2. Typewriter loop
  if (typewriterEl) {
    let index = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        if (index < textToType.length) {
          typewriterEl.textContent = textToType.slice(0, index + 1);
          index++;
        } else {
          clearInterval(interval);
          if (cursorEl) cursorEl.style.display = 'none';
        }
      }, speed);
    }, startDelay);
  }

  // 3. Quick Copy for Contact Pill
  if (copyContactBtn) {
    copyContactBtn.addEventListener('click', async () => {
      const email = 'decodelabs.tech@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const event = new CustomEvent('app:toast', {
          detail: { message: `📋 Copied ${email} to clipboard!` }
        });
        window.dispatchEvent(event);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }
}
