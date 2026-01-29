import { useCallback, useEffect, useState } from "react";

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
  const [scroll, setScroll] = useState<ScrollPosition>({ x: 0, y: 0 });

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

  useEffect(() => {
    // Set initial scroll position
    handleScroll();

    if (ref?.current) {
      // Listen to element scroll
      const target = ref.current;
      target.addEventListener("scroll", handleScroll);
      return () => {
        target.removeEventListener("scroll", handleScroll);
      };
    } else if (typeof window !== "undefined") {
      // Listen to window scroll
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [ref, handleScroll]);

  return scroll;
}
