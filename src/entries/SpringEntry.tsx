import { CSSProperties, ReactNode, useMemo } from 'react';
import { useSpringValues } from '../core/useSpringValues';
import type { SpringInput } from '../core/useSpring';

export interface SpringEntryProps {
  children: ReactNode;
  /** Whether the element is mounted/visible. Animates in on true, out on false. */
  show: boolean;
  /** Pixel offset the element travels from on entry (and to, on exit). */
  distance?: number;
  /** Direction the element slides in from. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Starting/ending scale factor. 1 = no scale animation. */
  fromScale?: number;
  spring?: SpringInput;
  className?: string;
  style?: CSSProperties;
}

const axisFor: Record<NonNullable<SpringEntryProps['direction']>, 'x' | 'y' | null> = {
  up: 'y',
  down: 'y',
  left: 'x',
  right: 'x',
  none: null,
};

const signFor: Record<NonNullable<SpringEntryProps['direction']>, number> = {
  up: 1,
  down: -1,
  left: 1,
  right: -1,
  none: 0,
};

/**
 * Generic spring-driven entry/exit animation: fades, slides, and/or scales
 * children in and out based on `show`. The base primitive other entry
 * components (FadeIn, SlideIn, PopIn) are built on.
 */
export function SpringEntry({
  children,
  show,
  distance = 24,
  direction = 'up',
  fromScale = 1,
  spring = 'default',
  className,
  style,
}: SpringEntryProps) {
  const axis = axisFor[direction];
  const sign = signFor[direction];

  const targets = useMemo(
    () => ({
      opacity: show ? 1 : 0,
      offset: show ? 0 : distance * sign,
      scale: show ? 1 : fromScale,
    }),
    [show, distance, sign, fromScale],
  );

  const animated = useSpringValues(targets, spring);

  const translate =
    axis === 'x'
      ? `translateX(${animated.offset}px)`
      : axis === 'y'
        ? `translateY(${animated.offset}px)`
        : '';

  return (
    <div
      className={className}
      style={{
        opacity: animated.opacity,
        transform: `${translate} scale(${animated.scale})`.trim(),
        willChange: 'transform, opacity',
        pointerEvents: animated.opacity < 0.05 ? 'none' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
