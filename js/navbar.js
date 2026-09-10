/**
 * DecodeLabs Project 1: Dynamic Island Navbar & Wayfinding Controller
 */

export function initNavbar() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileMenu = document.querySelector('.mobile-nav-menu');
  const navLinks = document.querySelectorAll('.nav-item-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id], article[id]');

  // Mobile menu toggle
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveLink(id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  function updateActiveLink(activeId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Sticky Island Scroll dynamics
  const island = document.querySelector('.nav-island');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (island) {
      if (currentScrollY > 60) {
        island.style.padding = '0.5rem 1.1rem';
        island.style.boxShadow = '0 16px 36px -8px rgba(0,0,0,0.6)';
      } else {
        island.style.padding = '0.65rem 1.25rem';
        island.style.boxShadow = 'var(--glass-shadow)';
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
}
