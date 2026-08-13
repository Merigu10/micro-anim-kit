import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { ParticleEngine, ParticleEngineOptions } from './particleEngine';

export interface ParticleCanvasHandle {
  engine: ParticleEngine;
}

export interface ParticleCanvasProps {
  width: number;
  height: number;
  options?: Partial<ParticleEngineOptions>;
  className?: string;
}

/**
 * Owns a <canvas>, a ParticleEngine instance, and the rAF loop that steps +
 * draws it. Exposes the engine via ref so callers (e.g. ConfettiBurst) can
 * spawn particles imperatively without re-rendering React on every frame.
 */
export const ParticleCanvas = forwardRef<ParticleCanvasHandle, ParticleCanvasProps>(
  ({ width, height, options, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<ParticleEngine>(new ParticleEngine(options));
    const frameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({ engine: engineRef.current }), []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      function tick(now: number) {
        if (!ctx) return;
        if (lastTimeRef.current === null) lastTimeRef.current = now;
        const dt = Math.min((now - lastTimeRef.current) / 1000, 1 / 30);
        lastTimeRef.current = now;

        engineRef.current.step(dt);
        ctx.clearRect(0, 0, width, height);
        engineRef.current.draw(ctx);

        frameRef.current = requestAnimationFrame(tick);
      }

      frameRef.current = requestAnimationFrame(tick);

      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        lastTimeRef.current = null;
      };
    }, [width, height]);

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{ width, height, pointerEvents: 'none' }}
      />
    );
  },
);

ParticleCanvas.displayName = 'ParticleCanvas';
