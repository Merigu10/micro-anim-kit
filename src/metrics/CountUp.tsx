import { useSpring } from '../core/useSpring';
import type { SpringInput } from '../core/useSpring';

export interface CountUpProps {
  /** Target numeric value. Changing it animates from the current displayed value. */
  value: number;
  /** Decimal places to display. */
  decimals?: number;
  /** Formats the settled numeric string, e.g. for thousand separators or currency. */
  format?: (value: number) => string;
  spring?: SpringInput;
  className?: string;
}

const defaultFormat = (decimals: number) => (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Animates a number counting up/down toward `value` using spring physics,
 * for KPI tiles and stat cards ("Revenue: $12,450") where a snap-to-new-value
 * feels abrupt but a duration-based tween feels generic.
 */
export function CountUp({ value, decimals = 0, format, spring = 'gentle', className }: CountUpProps) {
  const animated = useSpring(value, spring);
  const formatter = format ?? defaultFormat(decimals);

  return <span className={className}>{formatter(animated)}</span>;
}
