import { useEffect, useRef, useState } from 'react';
import { springPresets, stepSpring, type SpringConfig } from './spring';
import type { SpringInput } from './useSpring';

function resolveConfig(input: SpringInput | undefined): SpringConfig {
  if (!input) return springPresets.default;
  if (typeof input === 'string') return springPresets[input];
  return { ...springPresets.default, ...input };
}

const MAX_DT = 1 / 30;

/**
 * Like useSpring but animates a record of named numeric values in lockstep,
 * sharing a single rAF loop. Useful for entry transitions driving opacity + transform together.
 */
export function useSpringValues<T extends Record<string, number>>(
  targets: T,
  input?: SpringInput,
): T {
  const config = resolveConfig(input);
  const keys = Object.keys(targets) as (keyof T)[];

  const [values, setValues] = useState<T>(targets);

  const valuesRef = useRef<T>(targets);
  const velocitiesRef = useRef<Record<keyof T, number>>(
    Object.fromEntries(keys.map((k) => [k, 0])) as Record<keyof T, number>,
  );
  const targetsRef = useRef<T>(targets);
  const configRef = useRef(config);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  targetsRef.current = targets;
  configRef.current = config;

  useEffect(() => {
    function tick(now: number) {
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, MAX_DT);
      lastTimeRef.current = now;

      let allSettled = true;
      const nextValues = { ...valuesRef.current };

      for (const key of keys) {
        const result = stepSpring(
          valuesRef.current[key] as number,
          velocitiesRef.current[key],
          targetsRef.current[key] as number,
          configRef.current,
          dt,
        );
        nextValues[key] = result.value as T[keyof T];
        velocitiesRef.current[key] = result.velocity;
        if (!result.settled) allSettled = false;
      }

      valuesRef.current = nextValues;
      setValues(nextValues);

      if (!allSettled) {
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
  }, [JSON.stringify(targets), JSON.stringify(config)]);

  return values;
}
