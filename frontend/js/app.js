/**
 * DecodeLabs Project 1 & 2: Master Application Coordinator
 * Connects Week 1 (The Skin) & Week 2 (The Nervous System) modular chunks.
 */

// Week 1 Chunks: The Skin & UI Physics
import { initTheme } from './week1/theme.js?v=3.7';
import { initNavbar } from './week1/navbar.js?v=3.7';
import { initSimulator } from './week1/simulator.js?v=3.7';
import { initToolkit } from './week1/toolkit.js?v=3.7';
import { initRoadmap } from './week1/roadmap.js?v=3.7';
import { initMouseScrubVideo } from './week1/mouseScrub.js?v=3.7';
import { initHeroTypewriter } from './week1/typewriter.js?v=3.7';

// Week 2 Chunks: The Nervous System (REST API, Telemetry, Credentials)
import { initBadge } from './week2/badge.js?v=3.7';
import { initSystemPulse } from './week2/systemPulse.js?v=3.7';
import { initApiConsole } from './week2/apiConsole.js?v=3.7';

document.addEventListener('DOMContentLoaded', () => {
  const initializers = [
    { name: 'Theme', fn: initTheme },
    { name: 'Navbar', fn: initNavbar },
    { name: 'Simulator', fn: initSimulator },
    { name: 'Toolkit', fn: initToolkit },
    { name: 'Roadmap', fn: initRoadmap },
    { name: 'Badge & Credentials', fn: initBadge },
    { name: 'SystemPulse & ECG', fn: initSystemPulse },
    { name: 'API Console Sandbox', fn: initApiConsole },
    { name: 'MouseScrubVideo', fn: initMouseScrubVideo },
    { name: 'HeroTypewriter', fn: initHeroTypewriter },
    { name: 'LiquidGlassPhysics', fn: initLiquidGlassPhysics },
    { name: 'ToastSystem', fn: initToastSystem }
  ];

  initializers.forEach(mod => {
    try {
      mod.fn();
    } catch (err) {
      console.warn(`[Module Init Warning] ${mod.name}:`, err);
    }
  });

  console.log(
    '%c⚡ DecodeLabs Full-Stack Engine: Responsive Architecture & Nervous System ACTIVE',
    'color: #a0d4e0; font-size: 14px; font-weight: bold;'
  );
});

/**
 * Dynamic Mouse Lighting Follower & 3D Tilt Shaders
 */
function initLiquidGlassPhysics() {
  const tiltCards = document.querySelectorAll('.glass-card, .badge-interactive-card');

  // 3D Tilt effect on interactive cards (desktop only — skip touch devices)
  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
      });
    });
  }
}

/**
 * Toast Notification Dispatcher
 */
function initToastSystem() {
  const toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) return;

  window.addEventListener('app:toast', (e) => {
    const message = e.detail?.message || 'Action executed';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  });
}
