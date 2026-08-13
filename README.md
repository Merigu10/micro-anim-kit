# micro-anim-kit

A design system of micro-animations built specifically for **dashboard UIs** — not a general-purpose animation library. Every component maps to a pattern that actually shows up in dashboard/SaaS product work: a KPI tile that shouldn't jump when its value updates, a table row that needs to leave gracefully when dismissed, a sync indicator that pulses while polling.

Spring physics under the hood (not duration-based tweens), zero runtime dependencies beyond React, and a fully tree-shakeable, subpath-exported build.

## Why this instead of Framer Motion / react-spring?

Those are general-purpose animation engines — reasonable defaults, but you assemble the dashboard-specific pattern (KPI count-up, drag-to-dismiss toast, staggered row removal) yourself every time. micro-anim-kit ships the assembled pattern instead of the primitive.

| | micro-anim-kit | Framer Motion | react-spring |
|---|---|---|---|
| Scope | Dashboard-specific components | General-purpose animation | General-purpose spring physics |
| Full import (gzip) | **~7 kB** | ~50 kB+ | ~15 kB+ |
| Dependencies | 0 (peer: React only) | 0 | 0 |
| Per-category import | Yes (`/metrics`, `/gestures`, ...) | Partial | No |

Run `npm run size` in this repo to reproduce the numbers yourself — see [Bundle size](#bundle-size) below.

## Components, by dashboard pattern

| You need... | Use | 
|---|---|
| A KPI number that shouldn't jump on refresh | [`CountUp`](src/metrics/CountUp.tsx) |
| A trend line next to that number | [`Sparkline`](src/metrics/Sparkline.tsx) |
| A quota/SLA/usage gauge | [`ProgressRing`](src/metrics/ProgressRing.tsx) |
| A widget/table placeholder while data loads | [`Skeleton`](src/transitions/Skeleton.tsx) |
| A sync/status dot that pulses while polling | [`StatusPulse`](src/transitions/StatusPulse.tsx) |
| Crossfading between loading → success → error views | [`StateSwitch`](src/transitions/StateSwitch.tsx) |
| A table/list row that animates in on arrival, out on dismiss | [`StaggerList`](src/entries/StaggerList.tsx) |
| A card/badge that pops or slides in | [`FadeIn`](src/entries/presets.tsx) / [`SlideIn`](src/entries/presets.tsx) / [`PopIn`](src/entries/presets.tsx) |
| A dismissible toast/notification with swipe-to-close | [`DragDismiss`](src/gestures/DragDismiss.tsx) |
| A number ticking up/down with a directional spark (delta indicator) | [`MetricSpark`](src/particles/MetricSpark.tsx) |
| A "task complete" / milestone celebration | [`ConfettiBurst`](src/particles/ConfettiBurst.tsx) |
| Custom spring-driven values | [`useSpring`](src/core/useSpring.ts) / [`useSpringValues`](src/core/useSpringValues.ts) |

## Getting started

```bash
npm install
npm run dev       # start the demo app
npm run typecheck # type-check the library and demo
npm run build     # type-check and build the demo for production
npm run size      # build the library and print bundle size per entry point
```

The demo app in [demo/](demo/) showcases every component in the library. A deployed copy is published to GitHub Pages at **https://merigu10.github.io/micro-anim-kit/** on every push to `main` (see [.github/workflows/deploy-demo.yml](.github/workflows/deploy-demo.yml)).

> First-time setup: in the repo's Settings → Pages, set **Source** to "GitHub Actions". The workflow handles the rest.

### Import per category to keep bundles small

```ts
import { CountUp, Sparkline, ProgressRing } from 'micro-anim-kit/metrics';
import { DragDismiss } from 'micro-anim-kit/gestures';
import { StaggerList } from 'micro-anim-kit/entries';
```

Or import everything from the root — tree-shaking still applies, subpaths just make the intent explicit and avoid pulling in categories (like canvas particles) you don't use.

## Bundle size

Measured by `npm run size` (minified, gzip, React externalized as a peer dependency — not bundled):

| Entry point | Minified | Gzip |
|---|---|---|
| `core` | 0.28 kB | 0.18 kB |
| `entries` | 0.21 kB | 0.17 kB |
| `transitions` | 0.17 kB | 0.15 kB |
| `particles` | 0.21 kB | 0.17 kB |
| `gestures` | 0.15 kB | 0.13 kB |
| `metrics` | 0.17 kB | 0.15 kB |

These are the barrel re-exports; actual component code lives in shared chunks pulled in only when imported, so a page using just `CountUp` + `Sparkline` pays for those two components, not the whole library. Full `dist/` output (every component, every category) is under 30 kB minified / ~13 kB gzip combined.

## Project structure

```
src/
  core/        spring physics primitives (useSpring, useSpringValues, presets)
  entries/     entry/exit animations (SpringEntry, FadeIn/SlideIn/PopIn, StaggerList)
  gestures/    pointer-driven interactions (useDragDismiss, DragDismiss)
  transitions/ state/loading transitions (StateSwitch, StatusPulse, Skeleton)
  particles/   canvas particle engine (ConfettiBurst, MetricSpark)
  metrics/     KPI-tile primitives (CountUp, Sparkline, ProgressRing)
demo/          Vite + React demo app
```

## License

Private/unlicensed — add a license before publishing externally.
