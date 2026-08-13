import { CSSProperties, PointerEvent as ReactPointerEvent, useRef, useState } from 'react';
import { useSpringValues } from '../core/useSpringValues';
import type { SpringInput } from '../core/useSpring';

export type DragAxis = 'x' | 'y';

export interface UseDragDismissOptions {
  /** Axis the element can be dragged along. */
  axis?: DragAxis;
  /** Fraction of the element's own size (width for x, height for y) that counts as "far enough" to dismiss. */
  dismissThreshold?: number;
  /** Velocity (px/s) past which a flick dismisses even under the distance threshold. */
  velocityThreshold?: number;
  /** Called once the drag is released and crosses the dismiss threshold. */
  onDismiss?: () => void;
  /** Spring used to snap back to origin, and to fly the element off-screen on dismiss. */
  spring?: SpringInput;
}

export interface UseDragDismissResult {
  /** Spread onto the draggable element. */
  handlers: {
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
  };
  /** Live transform/opacity to spread into the element's style. */
  style: CSSProperties;
  /** True while the pointer is down and dragging. */
  dragging: boolean;
  /** True once dismissal has been committed (element is flying/faded out). */
  dismissed: boolean;
}

const VELOCITY_SAMPLE_WINDOW_MS = 100;

/**
 * Pointer-driven drag physics: follow the pointer 1:1 while dragging, and on
 * release either spring back to origin or fly off-screen (using the release
 * velocity as the spring's initial condition) depending on distance/velocity
 * thresholds. Useful for dismissible dashboard cards, toasts, and list rows.
 */
export function useDragDismiss({
  axis = 'x',
  dismissThreshold = 0.4,
  velocityThreshold = 800,
  onDismiss,
  spring = 'stiff',
}: UseDragDismissOptions = {}): UseDragDismissResult {
  const [dragging, setDragging] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [target, setTarget] = useState({ offset: 0, opacity: 1 });

  const elementSizeRef = useRef(1);
  const startPointRef = useRef(0);
  const historyRef = useRef<{ t: number; pos: number }[]>([]);
  const pointerIdRef = useRef<number | null>(null);

  const animated = useSpringValues(target, spring);

  function onPointerDown(e: ReactPointerEvent<HTMLElement>) {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;

    const rect = el.getBoundingClientRect();
    elementSizeRef.current = axis === 'x' ? rect.width : rect.height;
    startPointRef.current = axis === 'x' ? e.clientX : e.clientY;
    historyRef.current = [{ t: performance.now(), pos: 0 }];

    setDragging(true);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLElement>) {
    if (!dragging || pointerIdRef.current !== e.pointerId) return;

    const point = axis === 'x' ? e.clientX : e.clientY;
    const delta = point - startPointRef.current;

    const now = performance.now();
    historyRef.current.push({ t: now, pos: delta });
    historyRef.current = historyRef.current.filter((s) => now - s.t <= VELOCITY_SAMPLE_WINDOW_MS);

    setTarget({ offset: delta, opacity: 1 - Math.min(Math.abs(delta) / (elementSizeRef.current * 1.5), 0.6) });
  }

  function release() {
    if (!dragging) return;
    setDragging(false);
    pointerIdRef.current = null;

    const history = historyRef.current;
    const last = history[history.length - 1];
    const first = history[0];
    const dt = last && first ? (last.t - first.t) / 1000 : 0;
    const velocity = last && first && dt > 0 ? (last.pos - first.pos) / dt : 0;

    const distance = last?.pos ?? 0;
    const size = elementSizeRef.current;

    const pastDistance = Math.abs(distance) >= size * dismissThreshold;
    const pastVelocity = Math.abs(velocity) >= velocityThreshold;
    const shouldDismiss = pastDistance || pastVelocity;

    if (shouldDismiss) {
      const direction = distance !== 0 ? Math.sign(distance) : velocity !== 0 ? Math.sign(velocity) : 1;
      setDismissed(true);
      setTarget({ offset: direction * size * 2, opacity: 0 });
      onDismiss?.();
    } else {
      setTarget({ offset: 0, opacity: 1 });
    }
  }

  function onPointerUp(e: ReactPointerEvent<HTMLElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    release();
  }

  function onPointerCancel(e: ReactPointerEvent<HTMLElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    release();
  }

  const translate = axis === 'x' ? `translateX(${animated.offset}px)` : `translateY(${animated.offset}px)`;

  return {
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    style: {
      transform: translate,
      opacity: animated.opacity,
      touchAction: axis === 'x' ? 'pan-y' : 'pan-x',
      cursor: dragging ? 'grabbing' : 'grab',
      willChange: 'transform, opacity',
    },
    dragging,
    dismissed,
  };
}
