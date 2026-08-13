import { CSSProperties } from 'react';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  /** 'text' rounds like a line of text; 'block' rounds like a card/tile. */
  variant?: 'text' | 'block' | 'circle';
  className?: string;
  style?: CSSProperties;
}

const radiusFor: Record<NonNullable<SkeletonProps['variant']>, string> = {
  text: '4px',
  block: '8px',
  circle: '50%',
};

/**
 * Shimmering placeholder for a widget/tile/table cell that's still loading.
 * Pure CSS keyframe animation (no spring loop needed) — cheap to render many
 * of at once, e.g. a whole skeleton table while a dashboard's data resolves.
 */
export function Skeleton({ width = '100%', height = 16, variant = 'text', className, style }: SkeletonProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width,
        height,
        borderRadius: radiusFor[variant],
        background: 'linear-gradient(90deg, #1f2430 25%, #2a303e 37%, #1f2430 63%)',
        backgroundSize: '400% 100%',
        animation: 'micro-anim-kit-shimmer 1.4s ease infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes micro-anim-kit-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </span>
  );
}
