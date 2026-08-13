import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSpring } from '../core/useSpring';
import type { SpringInput } from '../core/useSpring';

export interface StateSwitchProps<K extends string> {
  /** Current state key. Changing this crossfades from the old to the new render. */
  state: K;
  /** Render function for the active state's content. */
  children: (state: K) => ReactNode;
  spring?: SpringInput;
  className?: string;
}

/**
 * Crossfades between differently-keyed content, e.g. loading -> success -> error
 * status displays. Keeps the outgoing node mounted just long enough to fade out.
 */
export function StateSwitch<K extends string>({
  state,
  children,
  spring = 'stiff',
  className,
}: StateSwitchProps<K>) {
  const [renderedState, setRenderedState] = useState(state);
  const [entering, setEntering] = useState(true);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state !== prevStateRef.current) {
      prevStateRef.current = state;
      setEntering(false);
    }
  }, [state]);

  const opacity = useSpring(entering ? 1 : 0, spring);

  useEffect(() => {
    if (!entering && opacity < 0.02) {
      setRenderedState(state);
      setEntering(true);
    }
  }, [entering, opacity, state]);

  return (
    <div className={className} style={{ display: 'grid' }}>
      <div
        style={{
          gridArea: '1 / 1',
          opacity,
          transform: `scale(${0.96 + opacity * 0.04})`,
        }}
      >
        {children(renderedState)}
      </div>
    </div>
  );
}
