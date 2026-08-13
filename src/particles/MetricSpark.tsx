import { useEffect, useRef } from 'react';
import { ParticleCanvas, ParticleCanvasHandle } from './ParticleCanvas';

export interface MetricSparkProps {
  /** Numeric value being displayed. A change triggers a directional spark burst. */
  value: number;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Small particle burst anchored to a metric/KPI number: sparks upward in
 * green on increase, downward in red on decrease. Meant to sit directly
 * behind or around a stat tile's number.
 */
export function MetricSpark({ value, width = 80, height = 40, className }: MetricSparkProps) {
  const handleRef = useRef<ParticleCanvasHandle>(null);
  const prevValue = useRef(value);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prevValue.current = value;
      return;
    }

    const engine = handleRef.current?.engine;
    const delta = value - prevValue.current;
    prevValue.current = value;
    if (!engine || delta === 0) return;

    const increased = delta > 0;
    const color = increased ? '#22c55e' : '#ef4444';
    const originPoint = { x: width / 2, y: height / 2 };

    engine.spawnBurst(10, originPoint, () => {
      const spread = (Math.random() - 0.5) * 60;
      const upSpeed = 60 + Math.random() * 60;
      return {
        vx: spread,
        vy: increased ? -upSpeed : upSpeed,
        maxLife: 0.5 + Math.random() * 0.3,
        size: 2 + Math.random() * 2,
        color,
        rotation: 0,
        vrotation: 0,
      };
    });
  }, [value, width, height]);

  return (
    <ParticleCanvas
      ref={handleRef}
      width={width}
      height={height}
      className={className}
      options={{ gravity: 60, drag: 0.98 }}
    />
  );
}
