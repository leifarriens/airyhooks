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
 * const windowScroll = useScroll();
 * console.log(windowScroll.x, windowScroll.y);
 *
 * // Track element scroll
 * const [ref, elementScroll] = useScroll<HTMLDivElement>();
 * return <div ref={ref}>Content</div>;
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

/**
 * Tracks scroll position with ref attachment for element scroll.
 *
 * @returns Tuple of [ref, scrollPosition]
 *
 * @example
 * const [ref, scroll] = useScrollElement<HTMLDivElement>();
 *
 * return (
 *   <div
 *     ref={ref}
 *     style={{ height: "200px", overflow: "auto" }}
 *   >
 *     <p>Scroll position: X: {scroll.x}, Y: {scroll.y}</p>
 *   </div>
 * );
 */
export function useScrollElement<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<null | T>,
  ScrollPosition,
] {
  const ref = useRef<T>(null);
  const scroll = useScroll(ref as React.RefObject<HTMLElement | null>);

  return [ref, scroll];
}
