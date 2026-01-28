import { useCallback, useRef, useState } from "react";

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
  const ref = useRef<T>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Attach event listeners to the ref
  const setRef = useCallback(
    (element: null | T) => {
      if (ref.current) {
        ref.current.removeEventListener("mouseenter", handleMouseEnter);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
      }

      if (element) {
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
      }

      ref.current = element;
    },
    [handleMouseEnter, handleMouseLeave],
  );

  // Return a proxy ref that updates the internal ref
  return [
    isHovered,
    {
      get current() {
        return ref.current;
      },
      set current(element: null | T) {
        setRef(element);
      },
    } as React.RefObject<T>,
  ];
}
