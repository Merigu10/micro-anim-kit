import { useSpring } from '../core/useSpring';

export type Status = 'idle' | 'loading' | 'success' | 'error';

const colorFor: Record<Status, string> = {
  idle: '#8a8f98',
  loading: '#3b82f6',
  success: '#22c55e',
  error: '#ef4444',
};

export interface StatusPulseProps {
  status: Status;
  size?: number;
}

/**
 * A small dot indicator that springs its scale and color-transitions on status
 * change, and pulses continuously while in the `loading` state. Useful for
 * dashboard tiles, table rows, or sync indicators.
 */
export function StatusPulse({ status, size = 10 }: StatusPulseProps) {
  const scale = useSpring(status === 'idle' ? 0.8 : 1, 'wobbly');

  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: colorFor[status],
        transform: `scale(${scale})`,
        transition: 'background-color 200ms ease',
        animation: status === 'loading' ? 'micro-anim-kit-pulse 1.1s ease-in-out infinite' : undefined,
        boxShadow: status === 'success' || status === 'error' ? `0 0 0 4px ${colorFor[status]}22` : undefined,
      }}
    >
      <style>{`
        @keyframes micro-anim-kit-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </span>
  );
}
