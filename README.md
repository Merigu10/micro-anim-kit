# micro-anim-kit

Library of reusable micro-animations for dashboard UIs: spring-physics entries, state transitions, gesture interactions, and canvas-based particles. Designed as a design system for rapid prototyping.

## Features

- **Spring physics core** — `useSpring` / `useSpringValues`, a damped-harmonic-oscillator integrator with named presets (`default`, `gentle`, `wobbly`, `stiff`, `slow`).
- **Entry animations** — `SpringEntry` primitive plus `FadeIn`, `SlideIn`, `PopIn` presets, and `StaggerList` for animating keyed lists in/out with per-item delay.
- **State transitions** — `StateSwitch` for crossfading between keyed content, `StatusPulse` for animated status indicators.
- **Gestures** — `useDragDismiss` / `DragDismiss` for pointer-driven drag-to-dismiss interactions with velocity-based flick detection.
- **Canvas particles** — `ParticleEngine`, `ParticleCanvas`, `ConfettiBurst`, `MetricSpark` for lightweight canvas-based particle effects.

## Getting started

```bash
npm install
npm run dev       # start the demo app
npm run typecheck # type-check the library and demo
npm run build     # type-check and build the demo for production
```

The demo app in [demo/](demo/) showcases every component in the library.

## Project structure

```
src/
  core/        spring physics primitives (useSpring, useSpringValues)
  entries/     entry/exit animations (SpringEntry, presets, StaggerList)
  gestures/    pointer-driven interactions (useDragDismiss, DragDismiss)
  transitions/ state transitions (StateSwitch, StatusPulse)
  particles/   canvas particle engine and components
demo/          Vite + React demo app
```

## License

Private/unlicensed — add a license before publishing externally.
