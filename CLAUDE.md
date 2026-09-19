# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MindTechPy corporate website: a static multi-page site with a single dark visual system ("Operaciones Visibles"). Built with Webpack + SCSS, served in production by Cloudflare Pages; an Express server exists for local development and Docker. Language: Spanish (Paraguay). No TypeScript. Tests use the built-in `node:test` runner.

## Commands

- `npm run dev` — Start Express dev server with DEBUG=true and nodemon (port 3000)
- `npm run build` — Webpack production build to `dist/` (hashed JS/CSS filenames)
- `npm run build:dev` — Webpack development build (with source maps)
- `npm start` — Start Express server (serves from `dist/`)
- `npm test` — `node --test test/`; `pretest` runs `npm run build` first, because the tests read the built `dist/`

Development requires two terminals: `npm run dev` (server) + `npm run build:dev` (webpack).

## Deployment

- **Production: Cloudflare Pages** — build command `npm run build`, output directory `dist`. Only `dist/` and `functions/` run there; the Express server does not.
- The GitHub Actions workflow that deployed to Kubernetes is disabled (`.github/workflows/deploy.yml.disabled`); the `k8s/` manifests are no longer used for deploys.
- **Docker** (self-hosted Express alternative): `docker compose up web` (port 3001) and `docker compose --profile dev up web-dev` (port 3000).

## Architecture

Each page is an HTML template in `src/pages/` built by its own `HtmlWebpackPlugin` entry in `webpack.config.js` and served at a clean URL.

| URL | Template | JS entry (chunk) | SCSS |
|-----|----------|------------------|------|
| `/` | `index.html` | `index.js` | `main.scss` |
| `/web-express` | `web-express.html` | `web-express.js` | `web-express.scss` |
| `/staff-augmentation` | `staff-augmentation.html` | `staff-augmentation.js` | `talento.scss` |
| `/trabaja-con-nosotros` | `trabaja-con-nosotros.html` | `trabaja-con-nosotros.js` | `talento.scss` |
| `/privacidad`, `/terminos`, `/eliminacion-de-datos` | one `.html` each | `legal.js` (shared chunk) | `legal.scss` |

- **`src/pages/index.js`** — Home entry: IntersectionObserver reveals, per-section meta, contact form (`POST /api/contact`, then WhatsApp redirect). Redirects the legacy hashes `/#legal`, `/#terminos`, `/#privacidad` to the standalone legal pages.
- **`src/pages/page-chrome.js`** — Shared secondary-page behaviour (`initPageChrome`: mobile nav, scroll progress bar, compact header, scroll reveals, smooth scroll) imported by every secondary-page entry.
- **`src/styles/main.scss`** — Home design system. **`src/styles/web-express.scss`** — tokens and shared components for secondary pages; `talento.scss` and `legal.scss` extend it with `@use 'web-express'`.
- **`functions/api/contact.js`** — Cloudflare Pages Function for `POST /api/contact` (`onRequestPost`): validates the payload and sends the email over SMTP via `cloudflare:sockets`. Configured through the Pages environment variables `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `CONTACT_TO`. This is the production contact endpoint.
- **`src/infrastructure/server.js`** — Express server for local dev/Docker: serves `dist/` then `public/`, one route per page, plus `POST /api/contact` (persists to `data/contacts.json`, optional nodemailer SMTP via `SMTP_*` env, disabled when `NODE_ENV=test`), `GET /api/visitors/stats`, `POST /api/visitors/visit` and `GET /api/health`. Exports `app` without listening so tests can import it; `DATA_DIR` isolates persistence in tests.
- **`src/infrastructure/VisitorCounter.js`** — File-based visitor counter with IP rate limiting (30min cache), persists to `data/visitors.json`. Express-only, and no page calls it today.
- **`test/`** — `build.test.js` (asserts on built HTML in `dist/`), `server.test.js` (Express endpoints), `contact-function.test.js` (Pages Function validation and MIME building).

## Key Conventions

- Server-side files use CommonJS (`require`/`module.exports`); client-side files and `functions/` use ES modules (`import`/`export`)
- Only the `public/` paths listed in the CopyWebpackPlugin patterns of `webpack.config.js` (images, `ads.txt`, `robots.txt`, `sitemap.xml`) reach `dist/` — a new static file must be added there or Cloudflare Pages will not serve it. `public/css/` and `public/js/` are legacy and unused.
- Tech logo images live in `src/assets/` (bundled by webpack) and `public/images/tech/`
- Local environment config via `.env` file (PORT, NODE_ENV, `SMTP_*`); DEBUG mode enabled by `export DEBUG=true`
- Visitor data stored in `data/visitors.json` (git-ignored, auto-created)
- Test names follow `should_[expected]_when_[condition]`
- No linter or formatter configured

## Legal Identity

"MindTechPy es el nombre comercial de Andrés Valentín Vera Chávez, RUC 5379057-0." It appears discreetly in the footer of every page, in the owner block (`section.legal__owner`, headed "Titular" / "Responsable del tratamiento") and `meta author` of the three legal pages, and in the home's Organization JSON-LD (`legalName`, `taxID`, `founder`). Never emphasize it visually, and keep all of these in sync when it changes.

## Interactive Design Directives

This is a **software development team website** — it must feel premium, modern, and technically impressive. Apply the `frontend-design` skill for all UI work.

### Visual Quality Standards
- Every section must have purposeful animations (scroll-triggered reveals, staggered entrances, parallax layers)
- Use SCSS variables for a cohesive color system; avoid hardcoded hex values
- Responsive-first: mobile breakpoint at 768px, tablet at 1024px
- Single dark theme (ink background, one violet accent); there is no light mode or theme toggle
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
