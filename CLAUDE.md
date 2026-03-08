# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MindTechPy corporate website with dual visual experience (Classic retro/vintage mode and Modern mode). Built with Express + Webpack + SCSS. Language: Spanish (Paraguay). No TypeScript, no test framework.

## Commands

- `npm run dev` — Start Express dev server with DEBUG=true and nodemon (port 3000)
- `npm run build` — Webpack production build to `dist/`
- `npm run build:dev` — Webpack development build (with source maps)
- `npm start` — Start production server (serves from `dist/`)

Development requires two terminals: `npm run dev` (server) + `npm run build:dev` (webpack).

## Architecture

Hexagonal-inspired structure with clear separation:

- **`src/pages/index.html`** — Single-page HTML with 8 tab sections (home, soluciones, tecnologias, precios, empresa, contacto, terminos, privacidad)
- **`src/pages/index.js`** — Client-side entry point: tab navigation via hash routing, mobile menu, scroll animations, IntersectionObserver reveals. Imports SCSS and firebase-config.
- **`src/styles/main.scss`** — Modern mode styles (SCSS variables, animations, responsive breakpoints at 768px)
- **`src/infrastructure/server.js`** — Express server serving `dist/` then `public/` as static, with visitor counter API endpoints (`GET /api/visitors/stats`, `POST /api/visitors/visit`)
- **`src/infrastructure/VisitorCounter.js`** — File-based visitor counter with IP rate limiting (30min cache), persists to `data/visitors.json`
- **`src/infrastructure/ApiAdapter.js`** — Generic fetch wrapper (client-side, ES module)
- **`src/infrastructure/DebugConfig.js`** — Debug feature flags (client-side, ES module)
- **`src/infrastructure/firebase-config.js`** — Firebase config placeholder (currently commented out)

## Theme System

- **Default: Classic mode** — Uses `public/css/classic-styles.css` (pure CSS, loaded as static file)
- **Modern mode** — Activated via `data-theme="modern"` on `<html>`, uses compiled `main.scss` from webpack bundle
- Theme persists in `localStorage`

## Key Conventions

- Server-side files use CommonJS (`require`/`module.exports`); client-side files use ES modules (`import`/`export`)
- Static assets in `public/` (images, classic CSS, ads.txt) are copied to `dist/` by CopyWebpackPlugin
- Tech logo images live in `src/assets/` (bundled by webpack) and `public/images/tech/`
- Environment config via `.env` file (PORT, NODE_ENV); DEBUG mode enabled by `export DEBUG=true`
- Visitor data stored in `data/visitors.json` (git-ignored, auto-created)
- No linter or formatter configured
- No test suite

## Interactive Design Directives

This is a **software development team website** — it must feel premium, modern, and technically impressive. Apply the `frontend-design` skill for all UI work.

### Visual Quality Standards
- Every section must have purposeful animations (scroll-triggered reveals, staggered entrances, parallax layers)
- Use SCSS variables for a cohesive color system; avoid hardcoded hex values
- Responsive-first: mobile breakpoint at 768px, tablet at 1024px
- Dark mode should feel as polished as light mode — not an afterthought
- Typography must use distinctive Google Fonts pairs (display + body), never system defaults

### Required UI Components
- **Hero section**: Full-viewport animated hero with particle/geometric effects, rotating taglines, and a clear CTA
- **Servicios/Soluciones**: Interactive cards with hover effects, icons, and expandable details
- **Equipo**: Team member cards with photo, role, skills badges, and social links
- **Tecnologías**: Animated tech stack grid with logo hover tooltips and category filtering
- **Testimonios/Clientes**: Carousel or masonry layout
- **Contacto**: Form with real-time validation, SCSS-styled inputs, and submission feedback animation
- **Navegación**: Sticky header with scroll-based opacity/blur, smooth scroll to sections, and active section indicator

### Micro-interactions
- Button hover: scale + shadow shift + color transition (200ms ease)
- Card hover: subtle lift (translateY) + shadow expansion
- Section entry: fade-in-up with staggered delay per child element using IntersectionObserver
- Loading states: skeleton screens or shimmer effects, never empty containers
- Scroll progress indicator in the navbar

## Performance Targets

- Lighthouse Performance score ≥ 90
- First Contentful Paint < 1.5s
- Total bundle size < 500KB (gzipped)
- Images: use WebP format, lazy loading with `loading="lazy"`
- Animations: prefer CSS `transform` and `opacity` (GPU-accelerated) over layout-triggering properties
- Avoid render-blocking resources; defer non-critical JS

## Accessibility (a11y)

- WCAG 2.1 Level AA compliance
- All interactive elements must be keyboard navigable
- Color contrast ratio ≥ 4.5:1 for text
- Form inputs must have associated `<label>` elements
- Images require meaningful `alt` attributes
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels on icon-only buttons and interactive elements

## SEO

- Unique `<title>` and `<meta name="description">` per conceptual page/section
- Single `<h1>` per page; proper heading hierarchy (h1 → h2 → h3)
- Structured data (JSON-LD) for Organization schema
- Open Graph and Twitter Card meta tags for social sharing
- Canonical URL tag
- Semantic HTML5 structure
- `<html lang="es">` attribute set
