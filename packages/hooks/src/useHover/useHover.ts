import { useCallback, useMemo, useRef, useState } from "react";

/**
 * Tracks mouse hover state on a DOM element via ref.
 *
 * @returns Tuple of [isHovered, ref]
 *
 * @example
 * const [isHovered, ref] = useHover();
 *
 * return (
 *   <div
 *     ref={ref}
 *     style={{
 *       backgroundColor: isHovered ? "blue" : "gray",
 *     }}
 *   >
 *     Hover me!
 *   </div>
 * );
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  boolean,
  React.RefObject<T>,
] {
  const elementRef = useRef<null | T>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const setRef = useCallback(
    (element: null | T) => {
      if (elementRef.current === element) {
        return;
      }

      if (elementRef.current) {
        elementRef.current.removeEventListener("mouseenter", handleMouseEnter);
        elementRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      elementRef.current = element;
      setIsHovered(false);

      if (element) {
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
      }
    },
    [handleMouseEnter, handleMouseLeave],
  );

  const ref = useMemo(
    () =>
      ({
        get current() {
          return elementRef.current;
        },
        set current(element: null | T) {
          setRef(element);
        },
      }) as React.RefObject<T>,
    [setRef],
  );

  return [isHovered, ref];
}
