export interface SpringConfig {
  /** Stiffness of the spring. Higher = snappier. */
  stiffness: number;
  /** Damping applied against velocity. Higher = less oscillation. */
  damping: number;
  /** Mass of the animated value. Higher = slower to accelerate. */
  mass: number;
  /** Values closer than this to the target, with near-zero velocity, are considered settled. */
  restDelta: number;
  /** Velocity below this is considered settled. */
  restVelocity: number;
}

export const springPresets = {
  default: { stiffness: 170, damping: 26, mass: 1, restDelta: 0.01, restVelocity: 0.01 },
  gentle: { stiffness: 120, damping: 20, mass: 1, restDelta: 0.01, restVelocity: 0.01 },
  wobbly: { stiffness: 180, damping: 12, mass: 1, restDelta: 0.01, restVelocity: 0.01 },
  stiff: { stiffness: 260, damping: 30, mass: 1, restDelta: 0.01, restVelocity: 0.01 },
  slow: { stiffness: 80, damping: 20, mass: 1.4, restDelta: 0.01, restVelocity: 0.01 },
} as const satisfies Record<string, SpringConfig>;

export type SpringPresetName = keyof typeof springPresets;

/**
 * Single-step semi-implicit Euler integrator for a damped harmonic oscillator.
 * dt is in seconds.
 */
export function stepSpring(
  value: number,
  velocity: number,
  target: number,
  config: SpringConfig,
  dt: number,
): { value: number; velocity: number; settled: boolean } {
  const { stiffness, damping, mass, restDelta, restVelocity } = config;

  const displacement = value - target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;

  const nextVelocity = velocity + acceleration * dt;
  const nextValue = value + nextVelocity * dt;

  const settled =
    Math.abs(nextVelocity) < restVelocity && Math.abs(nextValue - target) < restDelta;

  return settled
    ? { value: target, velocity: 0, settled: true }
    : { value: nextValue, velocity: nextVelocity, settled: false };
}
