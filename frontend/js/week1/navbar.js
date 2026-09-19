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

  // Smart Scroll Navigation (Auto-hide on scroll down, reveal on scroll up)
  const navHeader = document.querySelector('.nav-header');
  let lastScrollY = window.scrollY;
  const scrollThreshold = 8;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (!navHeader) return;

    // 1. Compact / elevated state when scrolled past 25px
    if (currentScrollY > 25) {
      navHeader.classList.add('is-scrolled');
    } else {
      navHeader.classList.remove('is-scrolled');
    }

    // 2. On desktop (> 768px), keep navbar ALWAYS visible at top (no auto-hide)
    if (window.innerWidth > 768) {
      navHeader.classList.remove('nav-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    // 3. Mobile only (<= 768px): Do not auto-hide if mobile menu is currently open
    const isMenuOpen = mobileMenu && mobileMenu.classList.contains('open');

    // 4. Mobile Smart auto-hide on scroll down, reveal on scroll up
    if (currentScrollY <= 40 || isMenuOpen) {
      navHeader.classList.remove('nav-hidden');
    } else if (delta > scrollThreshold && currentScrollY > 80) {
      navHeader.classList.add('nav-hidden');
    } else if (delta < -scrollThreshold) {
      navHeader.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}
