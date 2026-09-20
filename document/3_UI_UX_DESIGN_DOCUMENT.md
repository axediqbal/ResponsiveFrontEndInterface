# UI/UX DESIGN SPECIFICATION DOCUMENT
**Project Name:** DecodeLabs Full Stack Engineering — Qualification & Showcase Platform  
**Document Version:** 1.0.0  
**Design Philosophy:** 2026 Cybernetic Liquid Glassmorphism  
**Target Viewports:** 320px (Mobile Narrow) to 2560px (Ultra-wide Desktop)  

---

## 1. Aesthetic Vision & Design Pillars

The user interface balances high-tech terminal precision with elegant, modern glass surfaces.

1. **Depth Through Layering:** Multi-plane spatial hierarchy (Fixed video backdrop -> Tinted backdrop overlay -> Glass panels -> Elevated interactive controls).
2. **Dynamic Visual Vitality:** Ambient background motion, real-time typing indicators, and tactile micro-interactions that make the interface feel alive.
3. **Zero Layout Shift & Zero Blowout:** Strict adherence to container boundaries, mathematical fluidity via `clamp()`, and guaranteed zero horizontal scrolling on mobile.

---

## 2. Color System & Design Tokens

Design tokens are managed via CSS Custom Properties in `frontend/css/variables.css` supporting both Cyber Mocha and Ethereal Light themes:

```css
/* CYBER MOCHA THEME (DEFAULT / DARK MODE) */
:root, [data-theme="mocha"] {
  --bg-primary: #0e0d0b;
  --bg-secondary: #181512;
  --glass-bg: rgba(24, 21, 18, 0.72);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-glow: rgba(212, 163, 115, 0.15);
  
  --text-primary: #f7ede2;
  --text-secondary: #c5b8a5;
  --text-muted: #847563;

  --accent-amber: #d4a373;
  --accent-cyan: #5bc0be;
  --accent-emerald: #52b788;
  --accent-crimson: #e63946;
  
  --backdrop-blur: 16px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
}

/* ETHEREAL LIGHT THEME */
[data-theme="light"] {
  --bg-primary: #f8f6f0;
  --bg-secondary: #ece7dc;
  --glass-bg: rgba(255, 255, 255, 0.78);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-glow: rgba(212, 163, 115, 0.25);
  
  --text-primary: #2b2520;
  --text-secondary: #574c43;
  --text-muted: #8c7e72;
}
```

---

## 3. Typography Hierarchy & Fluid Math

Fonts are sourced from Google Fonts to convey both technical precision and editorial elegance:
- **Display & Headings:** `Space Grotesk`, sans-serif (High-tech geometric character).
- **Body & Controls:** `Inter`, sans-serif (Optimal legibility and clean glyphs).
- **Terminal & Telemetry:** `JetBrains Mono`, monospace (Fixed-width clarity for code and metrics).

### Fluid Typography Formulas
Instead of rigid pixel steps, headings scale continuously with the browser viewport using CSS `clamp()`:

```css
/* Hero Headline: Min 1.75rem (28px), Scaled 4vw, Max 3.25rem (52px) */
h1.hero-title {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.25rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* Section Subtitles */
h2.section-title {
  font-size: clamp(1.25rem, 2.5vw + 0.5rem, 2rem);
  line-height: 1.25;
}
```

---

## 4. Layout Architecture & Floor Plan

The application layout uses an asymmetric 2D CSS Grid structure:

```
┌────────────────────────────────────────────────────────────────────────┐
│  NAVIGATION & BRAND BAR (Logo, System Status, Theme Toggle)           │
├───────────────────────────────────┬────────────────────────────────────┤
│  LEFT COLUMN (40% Desktop)        │  RIGHT COLUMN (60% Desktop)        │
│                                   │                                    │
│  - Hero Intro Badge               │  - Interactive Credential Creator  │
│  - Live Typewriter Terminal       │    (Name, Email, Tier, Skills)     │
│  - System Telemetry & Uptime      │                                    │
│  - Real-Time Stats Strip          │  - Verified Badges Showcase Grid   │
│    (Total Badges, Cloud Sync)     │    (Filter Pills, Badge Cards)     │
├───────────────────────────────────┴────────────────────────────────────┤
│  FOOTER & SECURITY BADGE (Architecture Verification, GitHub Sync)      │
└────────────────────────────────────────────────────────────────────────┘
```

### The Golden Rule of Mobile Zero-Overflow
A frequent failure mode in web development is the horizontal blowout bug on mobile viewports (< 480px). This occurs when:
1. CSS Grid tracks are defined as `1fr` without specifying a minimum floor, defaulting to `minmax(auto, 1fr)`.
2. Long email strings, URLs, or non-wrapping badge tags expand the grid track beyond the screen width.

**The Architectural Fix Applied:**
```css
@media (max-width: 768px) {
  /* Force tracks to collapse down to 0 minimum width */
  .grid-layout,
  .badges-grid,
  .form-container {
    grid-template-columns: minmax(0, 1fr) !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Force long text and pills to wrap naturally */
  .badge-card,
  .action-pill,
  .skill-tag {
    white-space: normal !important;
    word-break: break-word !important;
    overflow-wrap: anywhere !important;
  }
}
```

---

## 5. Micro-Interactions & Sensory Dynamics

| Interaction | Trigger | Visual Effect & CSS Physics |
| :--- | :--- | :--- |
| **Live Ambient Video** | Background | `position: fixed; inset: 0; pointer-events: none; z-index: 0;` ensures smooth 60fps video playback without blocking user clicks or selection. |
| **Typewriter Cursor** | Ongoing Loop | Monospace terminal typing with a `blink 1s infinite step-end` cursor simulating real-time system connection. |
| **Glass Card Hover** | Cursor Mouseover | Subtle elevation `-4px` translateY with accent border glow `box-shadow: 0 12px 32px var(--glass-glow);`. |
| **Toast Notifications** | API Event | Slides in from top-right with cubic-bezier bounce physics, auto-dismissing after 3500ms. |
| **Theme Toggle** | Click Button | Smooth 250ms color transition across all CSS variables without page reloading. |
