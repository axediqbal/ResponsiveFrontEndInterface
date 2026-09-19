/**
 * DecodeLabs Project 1: Responsive Viewport Simulator & Grid Blueprint Inspector
 */

export function initSimulator() {
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  const deviceFrame = document.querySelector('.device-frame');
  const resolutionDisplay = document.querySelector('.viewport-resolution-label');
  const blueprintToggleBtns = document.querySelectorAll('.blueprint-toggle-btn');

  const RESOLUTIONS = {
    mobile: '390 × 844 px (Mobile-First Canvas)',
    tablet: '768 × 1024 px (Tablet Breakpoint)',
    laptop: '1024 × 768 px (Laptop Grid)',
    desktop: '100% Fluid 2D Grid (Ultra-Wide)'
  };

  viewportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      viewportBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (deviceFrame) {
        deviceFrame.className = `device-frame mode-${mode}`;
      }

      if (resolutionDisplay && RESOLUTIONS[mode]) {
        resolutionDisplay.textContent = RESOLUTIONS[mode];
      }

      const event = new CustomEvent('app:toast', {
        detail: { message: `Viewport transformed to: ${mode.toUpperCase()}` }
      });
      window.dispatchEvent(event);
    });
  });

  // Blueprint / Semantic Landmark Debugger Mode
  blueprintToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = document.body.classList.toggle('blueprint-mode-active');
      btn.setAttribute('aria-pressed', isActive.toString());

      const statusText = isActive ? 'Blueprint Inspection ON (Landmarks Highlighted)' : 'Blueprint Inspection OFF';
      const event = new CustomEvent('app:toast', {
        detail: { message: statusText }
      });
      window.dispatchEvent(event);
    });
  });
}
