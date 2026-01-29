import { useCallback, useEffect, useRef, useState } from "react";

export interface UseMeasureRect {
  /** Bottom position relative to viewport */
  bottom: number;
  /** Element height */
  height: number;
  /** Left position relative to viewport */
  left: number;
  /** Right position relative to viewport */
  right: number;
  /** Top position relative to viewport */
  top: number;
  /** Element width */
  width: number;
  /** X position (same as left) */
  x: number;
  /** Y position (same as top) */
  y: number;
}

export interface UseMeasureResult<T extends Element> {
  /** The measured dimensions of the element */
  rect: UseMeasureRect;
  /** Ref to attach to the element to measure */
  ref: React.RefCallback<T>;
}

const defaultRect: UseMeasureRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
};

/**
 * Measure the dimensions of a DOM element using ResizeObserver.
 *
 * @returns Object containing ref callback and rect measurements
 *
 * @example
 * const { ref, rect } = useMeasure<HTMLDivElement>();
 *
 * return (
 *   <div ref={ref}>
 *     <p>Width: {rect.width}px</p>
 *     <p>Height: {rect.height}px</p>
 *   </div>
 * );
 *
 * @example
 * // Responsive component
 * const { ref, rect } = useMeasure<HTMLDivElement>();
 * const isCompact = rect.width < 400;
 *
 * return (
 *   <nav ref={ref} className={isCompact ? 'compact' : 'full'}>
 *     {isCompact ? <MobileMenu /> : <DesktopMenu />}
 *   </nav>
 * );
 */
export function useMeasure<
  T extends Element = HTMLDivElement,
>(): UseMeasureResult<T> {
  const [element, setElement] = useState<null | T>(null);
  const [rect, setRect] = useState<UseMeasureRect>(defaultRect);

  const observerRef = useRef<null | ResizeObserver>(null);

  const ref = useCallback((node: null | T) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) {
      return;
    }

    if (typeof ResizeObserver === "undefined") {
      // Fallback: get initial dimensions without observing changes
      const boundingRect = element.getBoundingClientRect();
      setRect({
        bottom: boundingRect.bottom,
        height: boundingRect.height,
        left: boundingRect.left,
        right: boundingRect.right,
        top: boundingRect.top,
        width: boundingRect.width,
        x: boundingRect.x,
        y: boundingRect.y,
      });
      return;
    }

    observerRef.current = new ResizeObserver(([entry]) => {
      if (entry) {
        const boundingRect = entry.target.getBoundingClientRect();
        setRect({
          bottom: boundingRect.bottom,
          height: boundingRect.height,
          left: boundingRect.left,
          right: boundingRect.right,
          top: boundingRect.top,
          width: boundingRect.width,
          x: boundingRect.x,
          y: boundingRect.y,
        });
      }
    });

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [element]);

  return { rect, ref };
}
