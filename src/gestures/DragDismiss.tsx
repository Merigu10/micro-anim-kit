import { CSSProperties, ReactNode } from 'react';
import { useDragDismiss, type UseDragDismissOptions } from './useDragDismiss';

export interface DragDismissProps extends UseDragDismissOptions {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Drag-to-dismiss wrapper: wraps children in a pointer-draggable element that
 * follows the pointer, fades as it's dragged, and either snaps back or flies
 * off and calls `onDismiss` depending on release distance/velocity. Good for
 * dismissible notification/toast cards and swipeable list rows.
 */
export function DragDismiss({ children, className, style, ...options }: DragDismissProps) {
  const { handlers, style: dragStyle } = useDragDismiss(options);

  return (
    <div className={className} style={{ ...dragStyle, ...style }} {...handlers}>
      {children}
    </div>
  );
}

export type { DragAxis, UseDragDismissOptions, UseDragDismissResult } from './useDragDismiss';
