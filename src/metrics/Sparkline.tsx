import { useMemo, useRef } from 'react';
import { useSpring } from '../core/useSpring';
import type { SpringInput } from '../core/useSpring';

export interface SparklineProps {
  /** Series of numeric values, oldest first. */
  data: number[];
  width?: number;
  height?: number;
  /** Stroke color of the line. */
  color?: string;
  /** Fill under the line, or 'none' to disable. */
  fill?: string | 'none';
  strokeWidth?: number;
  /** Spring used to animate the line growing/updating as `data` changes. */
  spring?: SpringInput;
  className?: string;
}

function buildPath(data: number[], width: number, height: number, padding: number) {
  if (data.length === 0) return { line: '', area: '' };

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
  const points = data.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const area = `${line} L${points[points.length - 1][0].toFixed(2)},${height} L${points[0][0].toFixed(2)},${height} Z`;

  return { line, area };
}

/**
 * Small trend-line chart that animates its overall shape (via a scale/opacity
 * spring) whenever `data` changes — meant to sit inline in a KPI tile next to
 * a CountUp value, not as a full charting solution.
 */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  color = '#3b82f6',
  fill = 'none',
  strokeWidth = 1.5,
  spring = 'gentle',
  className,
}: SparklineProps) {
  const padding = strokeWidth;
  const { line, area } = useMemo(() => buildPath(data, width, height, padding), [data, width, height, padding]);

  const prevDataKey = useRef(data.map((v) => v.toFixed(2)).join(','));
  const dataKey = data.map((v) => v.toFixed(2)).join(',');
  const changed = prevDataKey.current !== dataKey;
  prevDataKey.current = dataKey;

  const emphasis = useSpring(changed ? 1 : 0, spring);
  const scaleY = 0.85 + emphasis * 0.15;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <g style={{ transformOrigin: `center ${height}px`, transform: `scaleY(${scaleY})` }}>
        {fill !== 'none' && <path d={area} fill={fill} stroke="none" />}
        <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
