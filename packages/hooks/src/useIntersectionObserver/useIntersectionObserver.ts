import { useEffect, useMemo, useRef, useState } from "react";

export interface UseIntersectionObserverOptions {
  /** Whether to stop observing after the first intersection (default: false) */
  once?: boolean;
  /** The element used as the viewport for checking visibility (default: browser viewport) */
  root?: Element | null;
  /** Margin around the root element (e.g., "10px 20px 30px 40px") */
  rootMargin?: string;
  /** A number or array of numbers indicating at what percentage of visibility the callback should trigger */
  threshold?: number | number[];
}

export interface UseIntersectionObserverResult {
  /** The current intersection observer entry */
  entry: IntersectionObserverEntry | null;
  /** Whether the element is currently intersecting */
  isIntersecting: boolean;
  /** Ref to attach to the element to observe */
  ref: React.RefObject<HTMLElement | null>;
}

/**
 * Track the visibility of a DOM element within the viewport using IntersectionObserver.
 *
 * @param options - IntersectionObserver configuration options
 * @returns Object containing ref, entry, and isIntersecting state
 *
 * @example
 * // Basic usage - lazy load an image
 * const { ref, isIntersecting } = useIntersectionObserver();
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting && <img src="large-image.jpg" />}
 *   </div>
 * );
 *
 * @example
 * // Infinite scroll with threshold
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   rootMargin: '100px',
 * });
 *
 * useEffect(() => {
 *   if (isIntersecting) loadMoreItems();
 * }, [isIntersecting]);
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverResult {
  const {
    once = false,
    root = null,
    rootMargin = "0px",
    threshold = 0,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const hasTriggered = useRef(false);
  const ref = useMemo(
    () => ({
      get current() {
        return elementRef.current;
      },
      set current(node: HTMLElement | null) {
        if (elementRef.current !== node) {
          elementRef.current = node;
          setEntry(null);
          setElement(node);
        }
      },
    }),
    [],
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    if (once && hasTriggered.current) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        if (!observerEntry) {
          return;
        }

        setEntry(observerEntry);

        if (once && observerEntry.isIntersecting) {
          hasTriggered.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, root, rootMargin, threshold, once]);

  return {
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
    ref,
  };
}
