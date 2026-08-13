import { ReactNode } from 'react';
import { useSpring } from '../core/useSpring';
import type { SpringInput } from '../core/useSpring';

export interface ProgressRingProps {
  /** Progress fraction from 0 to 1. */
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  spring?: SpringInput;
  /** Rendered centered inside the ring, e.g. a CountUp percentage. */
  children?: ReactNode;
  className?: string;
}

/**
 * Circular progress/gauge indicator that springs to `value` on change instead
 * of snapping — for SLA/quota/resource-usage widgets where the value updates
 * periodically (polling, websocket) and a discrete jump reads as a glitch.
 */
export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  color = '#3b82f6',
  trackColor = '#262b36',
  spring = 'gentle',
  children,
  className,
}: ProgressRingProps) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const animated = useSpring(clamped, spring);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - animated);

  return (
    <div className={className} style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
