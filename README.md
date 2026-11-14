# personal-site

**Live:** https://thenkei.github.io/personal-site/

Personal site of Morgan Perre, designed as a generative topographic map: the hero is a seeded contour map that can be regenerated, and the career is read as a trail (route log plus elevation profile).

Stack: Vite, React 19, TypeScript, Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev      # dev server with HMR
npm run build    # type-check (tsc -b) + production build into dist/
npm run lint     # ESLint
npm run preview  # serve the production build locally
```

## Editing content

Everything the site says lives in `src/content.ts`:

- `profile`: name, headline, pitch, status, contact links, location.
- `legs`: organisations (work or study), most recent first, each with `roles` (oldest first).
- `toolkit`: `practice` list and `stack` grouped by domain (`{ group, items }`) for the Toolkit section.
- `offTrail`: term/detail pairs shown alongside the toolkit.

Each `Role` has an `elevation` (0 to 1) that sets its height on the career elevation profile. Roles are flattened across all legs and sorted automatically by `start`, so you never order or lay out the profile by hand: add a role with an `elevation` and it appears in both the profile and the route log (linked by `Role.id`). Omit `end` for the current role.

## Architecture

- `src/lib/terrain.ts`: seeded PRNG builds a heightfield (gaussian hills plus low-frequency ridging); contour lines are extracted with marching squares. Same seed, same map.
- `src/components/TopoMap.tsx`: renders the contours as SVG, memoised on `seed`, with a draw-in animation that replays on regenerate.
- `src/components/ElevationProfile.tsx`: career drawn as a trail profile; checkpoints are evenly spaced stages, heights come from `Role.elevation`.
- `src/components/Route.tsx`: chronological route log, synced with the profile by role id.
- `src/components/ThemeToggle.tsx`: light/dark switch.
- `Hero.tsx`, `TrailBlaze.tsx`: page sections and decoration.

## Theming

Colours are CSS custom properties (`--paper`, `--ink`, `--accent`, ...) defined in `src/index.css`; components never hard-code theme colours. Dark values apply via `prefers-color-scheme` unless overridden by `data-theme="light"` on `<html>`, and `data-theme="dark"` forces dark. `ThemeToggle` sets `data-theme` and persists the choice in `localStorage` under the key `theme` (storage failures are tolerated). The contact band stays dark in both themes.

## Typography

Fonts are loaded from Google Fonts in `index.html` and mapped to Tailwind utilities in the `@theme` block of `src/index.css`:

- Bricolage Grotesque (variable optical size): display and body, via `font-display` and `font-sans`.
- Instrument Serif italic: accent words only, via `font-serif`.
- JetBrains Mono: labels, dates and metadata, via `font-mono`.

## Deployment

`.github/workflows/deploy.yml` builds with Node 20 and deploys `dist/` to GitHub Pages on every push to `main` (or manually via workflow dispatch). `vite.config.ts` sets `base: '/personal-site/'`, so the site is served from `/personal-site/`; change it if the repository is renamed or a custom domain is used.
