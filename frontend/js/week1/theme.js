/**
 * DecodeLabs Project 1: Theme & Visual Palette Controller
 * Switches between Cyber Void (Dark), Warm Earth (Mocha Mousse / 2026 Refined), and Ethereal Light.
 */

const THEMES = ['dark', 'warm-earth', 'ethereal-light'];
const STORAGE_KEY = 'decodelabs_theme_pref';

export function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(savedTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', cycleTheme);
  });
}

export function cycleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const currentIndex = THEMES.indexOf(currentTheme);
  const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
  applyTheme(nextTheme);
  localStorage.setItem(STORAGE_KEY, nextTheme);

  // Dispatch toast
  const event = new CustomEvent('app:toast', {
    detail: { message: `Switched to ${formatThemeName(nextTheme)} Theme` }
  });
  window.dispatchEvent(event);
}

export function applyTheme(themeName) {
  if (themeName === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeName);
  }
  updateThemeIcons(themeName);
}

function formatThemeName(name) {
  if (name === 'warm-earth') return 'Warm Earth (Mocha Mousse)';
  if (name === 'ethereal-light') return 'Ethereal Crystal Light';
  return 'Cyber Void Dark';
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    if (theme === 'warm-earth') {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`;
    } else if (theme === 'ethereal-light') {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>`;
    } else {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  });
}
