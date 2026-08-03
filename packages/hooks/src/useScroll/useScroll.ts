import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Tracks scroll position of an element or the window.
 *
 * @param ref - Optional ref to an element. If not provided, tracks window scroll
 * @returns Object with x and y scroll positions
 *
 * @example
 * // Track window scroll
 * const scroll = useScroll();
 * console.log(scroll.x, scroll.y);
 *
 * @example
 * // Track element scroll
 * const elementRef = useRef<HTMLDivElement>(null);
 * const scroll = useScroll(elementRef);
 * return <div ref={elementRef} style={{ overflow: 'auto' }}>Content</div>;
 */
export function useScroll(
  ref?: React.RefObject<HTMLElement | null>,
): ScrollPosition {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const handleScroll = useCallback(() => {
    if (ref?.current) {
      setScroll({
        x: ref.current.scrollLeft,
        y: ref.current.scrollTop,
      });
    } else if (typeof window !== "undefined") {
      setScroll({
        x: window.scrollX,
        y: window.scrollY,
      });
    }
  }, [ref]);

  const handleScrollRef = useRef(handleScroll);
  const listenerTargetRef = useRef<HTMLElement | null | Window>(null);
  const scrollListener = useCallback(() => {
    handleScrollRef.current();
  }, []);

  useEffect(() => {
    handleScrollRef.current = handleScroll;
  }, [handleScroll]);

  useEffect(() => {
    const target: HTMLElement | null | Window =
      ref?.current ?? (typeof window !== "undefined" ? window : null);
    const previousTarget = listenerTargetRef.current;

    if (previousTarget !== target) {
      previousTarget?.removeEventListener("scroll", scrollListener);
      target?.addEventListener("scroll", scrollListener);
      listenerTargetRef.current = target;
      // Set the initial position whenever the tracked target changes.
      handleScroll();
    }
  });

  useEffect(() => {
    return () => {
      listenerTargetRef.current?.removeEventListener("scroll", scrollListener);
      listenerTargetRef.current = null;
    };
  }, [scrollListener]);

  return scroll;
}
