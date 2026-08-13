import { Children, CSSProperties, ReactNode, isValidElement, useEffect, useRef, useState } from 'react';
import { useSpringValues } from '../core/useSpringValues';
import type { SpringInput } from '../core/useSpring';
import type { SpringEntryProps } from './SpringEntry';

export interface StaggerListProps {
  /** Keyed children — each must carry a stable `key` so entries/exits track correctly. */
  children: ReactNode;
  /** Delay in ms added per item, in list order, before its entry animation starts. */
  staggerMs?: number;
  /** Direction/distance/scale applied to each item, same semantics as SpringEntry. */
  direction?: SpringEntryProps['direction'];
  distance?: number;
  fromScale?: number;
  spring?: SpringInput;
  className?: string;
  style?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
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

interface StaggerItemProps {
  show: boolean;
  delayMs: number;
  direction: NonNullable<SpringEntryProps['direction']>;
  distance: number;
  fromScale: number;
  spring?: SpringInput;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onExited: () => void;
}

/**
 * A single stagger-list item. Delays flipping its internal `show` target by
 * `delayMs` on entry (so later items visibly lag earlier ones), and reports
 * back once its exit animation has settled so the list can drop it from the DOM.
 */
function StaggerItem({
  show,
  delayMs,
  direction,
  distance,
  fromScale,
  spring,
  className,
  style,
  children,
  onExited,
}: StaggerItemProps) {
  const [delayedShow, setDelayedShow] = useState(show ? delayMs === 0 : true);

  useEffect(() => {
    if (show && delayMs > 0) {
      setDelayedShow(false);
      const timer = window.setTimeout(() => setDelayedShow(true), delayMs);
      return () => window.clearTimeout(timer);
    }
    setDelayedShow(show);
  }, [show, delayMs]);

  const axis = axisFor[direction];
  const sign = signFor[direction];

  const targets = {
    opacity: delayedShow ? 1 : 0,
    offset: delayedShow ? 0 : distance * sign,
    scale: delayedShow ? 1 : fromScale,
  };

  const animated = useSpringValues(targets, spring);

  const exitedRef = useRef(false);
  useEffect(() => {
    if (!show && !delayedShow && animated.opacity < 0.02) {
      if (!exitedRef.current) {
        exitedRef.current = true;
        onExited();
      }
    } else if (show) {
      exitedRef.current = false;
    }
  }, [show, delayedShow, animated.opacity, onExited]);

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

/**
 * Animates a list of keyed children in and out with a per-item stagger delay.
 * Add, remove, or reorder children freely — items removed from `children` stay
 * mounted just long enough to play their exit animation, then unmount themselves.
 */
export function StaggerList({
  children,
  staggerMs = 40,
  direction = 'up',
  distance = 16,
  fromScale = 1,
  spring = 'default',
  className,
  style,
  itemClassName,
  itemStyle,
}: StaggerListProps) {
  const items = Children.toArray(children).filter(isValidElement);
  const currentKeys = items.map((item) => String(item.key));

  const [renderedKeys, setRenderedKeys] = useState<string[]>(currentKeys);
  const itemsByKey = useRef<Map<string, ReactNode>>(new Map());
  for (const item of items) {
    itemsByKey.current.set(String(item.key), item);
  }

  const joinedKeys = currentKeys.join('|');
  useEffect(() => {
    setRenderedKeys((prev) => {
      const next = [...prev];
      for (const key of currentKeys) {
        if (!next.includes(key)) next.push(key);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinedKeys]);

  const currentKeySet = new Set(currentKeys);

  return (
    <div className={className} style={style}>
      {renderedKeys.map((key, index) => {
        const node = itemsByKey.current.get(key);
        if (!node) return null;
        const show = currentKeySet.has(key);

        return (
          <StaggerItem
            key={key}
            show={show}
            delayMs={index * staggerMs}
            direction={direction ?? 'up'}
            distance={distance}
            fromScale={fromScale}
            spring={spring}
            className={itemClassName}
            style={itemStyle}
            onExited={() => setRenderedKeys((prev) => prev.filter((k) => k !== key))}
          >
            {node}
          </StaggerItem>
        );
      })}
    </div>
  );
}
