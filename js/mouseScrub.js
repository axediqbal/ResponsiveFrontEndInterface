/**
 * DecodeLabs 2026: Live Cybernetic Ambient Video Engine
 * Hardware-accelerated 60fps continuous playback with silky-smooth GPU parallax.
 * Zero lag, zero seeking stalls, completely live and fluid.
 */

export function initMouseScrubVideo() {
  const video = document.getElementById('retro-bg-video');
  if (!video) return;

  // 1. Ensure smooth 60fps continuous live playback
  video.muted = true;
  video.playbackRate = 1.0;

  const startPlayback = () => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: start smoothly on first touch/click/scroll
        const triggerPlay = () => {
          video.play().catch(() => {});
          window.removeEventListener('pointerdown', triggerPlay);
          window.removeEventListener('scroll', triggerPlay);
        };
        window.addEventListener('pointerdown', triggerPlay, { once: true });
        window.addEventListener('scroll', triggerPlay, { once: true });
      });
    }
  };

  if (video.readyState >= 2) {
    startPlayback();
  } else {
    video.addEventListener('canplay', startPlayback, { once: true });
  }

  // 2. High-performance GPU parallax without seeking frames (zero stutter)
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isMoving = false;
  let rafId = null;

  function updateParallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    // Subtle 3D camera pan: max 16px shift with 1.05 scale to prevent edge gaps
    video.style.transform = `scale(1.05) translate3d(${-currentX}px, ${-currentY}px, 0)`;

    if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      isMoving = false;
      rafId = null;
    }
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener(
      'mousemove',
      (e) => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        mouseX = ((e.clientX - halfW) / halfW) * 16;
        mouseY = ((e.clientY - halfH) / halfH) * 12;

        if (!isMoving) {
          isMoving = true;
          rafId = requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );
  }
}
