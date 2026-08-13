import { useEffect, useRef, useState } from 'react';
import { springPresets, stepSpring, type SpringConfig, type SpringPresetName } from './spring';

export type SpringInput = SpringPresetName | Partial<SpringConfig>;

function resolveConfig(input: SpringInput | undefined): SpringConfig {
  if (!input) return springPresets.default;
  if (typeof input === 'string') return springPresets[input];
  return { ...springPresets.default, ...input };
}

const MAX_DT = 1 / 30;

/**
 * Animates a numeric value toward `target` using spring physics.
 * Re-runs the physics loop via requestAnimationFrame whenever target/config change
 * or the spring hasn't settled yet.
 */
export function useSpring(target: number, input?: SpringInput): number {
  const config = resolveConfig(input);
  const [value, setValue] = useState(target);

  const valueRef = useRef(target);
  const velocityRef = useRef(0);
  const targetRef = useRef(target);
  const configRef = useRef(config);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  targetRef.current = target;
  configRef.current = config;

  useEffect(() => {
    function tick(now: number) {
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, MAX_DT);
      lastTimeRef.current = now;

      const result = stepSpring(
        valueRef.current,
        velocityRef.current,
        targetRef.current,
        configRef.current,
        dt,
      );

      valueRef.current = result.value;
      velocityRef.current = result.velocity;
      setValue(result.value);

      if (!result.settled) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        lastTimeRef.current = null;
      }
    }

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        lastTimeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, JSON.stringify(config)]);

  return value;
}
