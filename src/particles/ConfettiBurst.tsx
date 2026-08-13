import { useEffect, useRef } from 'react';
import { ParticleCanvas, ParticleCanvasHandle } from './ParticleCanvas';

export interface ConfettiBurstProps {
  /** Increment this (or toggle) to trigger a new burst. */
  trigger: number;
  width?: number;
  height?: number;
  count?: number;
  colors?: string[];
  origin?: { x: number; y: number };
  className?: string;
}

const defaultColors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];

/**
 * Fires a confetti burst from `origin` every time `trigger` changes.
 * Good for "task complete" / milestone-hit moments on a dashboard.
 */
export function ConfettiBurst({
  trigger,
  width = 240,
  height = 160,
  count = 40,
  colors = defaultColors,
  origin,
  className,
}: ConfettiBurstProps) {
  const handleRef = useRef<ParticleCanvasHandle>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const engine = handleRef.current?.engine;
    if (!engine) return;

    const originPoint = origin ?? { x: width / 2, y: height / 2 };

    engine.spawnBurst(count, originPoint, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 220;
      return {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 160,
        maxLife: 0.9 + Math.random() * 0.6,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        vrotation: (Math.random() - 0.5) * 10,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <ParticleCanvas
      ref={handleRef}
      width={width}
      height={height}
      className={className}
      options={{ gravity: 500, drag: 0.99 }}
    />
  );
}
