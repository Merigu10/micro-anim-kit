import { ReactNode } from 'react';
import { SpringEntry, SpringEntryProps } from './SpringEntry';

type PresetProps = Omit<SpringEntryProps, 'direction' | 'fromScale' | 'distance'> & {
  children: ReactNode;
};

/** Fades content in/out in place, no movement. */
export function FadeIn(props: PresetProps) {
  return <SpringEntry {...props} direction="none" distance={0} fromScale={1} />;
}

/** Slides content in from a direction while fading. */
export function SlideIn(props: PresetProps & { direction?: SpringEntryProps['direction']; distance?: number }) {
  return <SpringEntry direction="up" distance={24} {...props} />;
}

/** Scales content up from a smaller size while fading in — good for cards/badges appearing. */
export function PopIn(props: PresetProps & { fromScale?: number }) {
  return <SpringEntry {...props} direction="none" distance={0} fromScale={props.fromScale ?? 0.85} spring={props.spring ?? 'wobbly'} />;
}
