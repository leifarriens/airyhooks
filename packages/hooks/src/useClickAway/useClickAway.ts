import { useEffect } from "react";

/**
 * Detects clicks outside of a target element.
 *
 * @param ref - React ref to the target element
 * @param callback - Function to call when click outside is detected
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 *
 * useClickAway(ref, () => {
 *   setIsOpen(false);
 * });
 *
 * return <div ref={ref}>Content</div>;
 */
export function useClickAway<T extends HTMLElement>(
  ref: React.RefObject<null | T>,
  callback: () => void,
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const element = ref.current;
      if (element && !element.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
