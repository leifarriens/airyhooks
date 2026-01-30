import { useCallback, useEffect, useRef } from "react";

export interface ThrottledCallbackOptions {
  /**
   * Whether to invoke the callback on the leading edge (immediately on first call).
   * @default true
   */
  leading?: boolean;
  /**
   * Whether to invoke the callback on the trailing edge (after the interval).
   * @default true
   */
  trailing?: boolean;
}

/**
 * Creates a throttled version of a callback function.
 * The callback will execute at most once per specified interval.
 *
 * @param callback - The function to throttle
 * @param interval - The throttle interval in milliseconds (default: 500ms)
 * @param options - Configuration options for leading/trailing edge behavior
 * @returns A tuple containing [throttledCallback, cancel]
 *
 * @example
 * const [throttledScroll, cancel] = useThrottledCallback((e: Event) => {
 *   console.log("Scroll position:", window.scrollY);
 * }, 100);
 *
 * useEffect(() => {
 *   window.addEventListener("scroll", throttledScroll);
 *   return () => window.removeEventListener("scroll", throttledScroll);
 * }, [throttledScroll]);
 *
 * @example
 * // Trailing edge only (no immediate execution)
 * const [throttled] = useThrottledCallback(callback, 500, { leading: false });
 */
export function useThrottledCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  interval = 500,
  options: ThrottledCallbackOptions = {},
): [(...args: T) => void, () => void] {
  const { leading = true, trailing = true } = options;

  const callbackRef = useRef(callback);
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const lastArgsRef = useRef<null | T>(null);
  const lastCallTimeRef = useRef<null | number>(null);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    lastArgsRef.current = null;
    lastCallTimeRef.current = null;
  }, []);

  const throttledCallback = useCallback(
    (...args: T) => {
      const now = Date.now();
      const timeSinceLastCall =
        lastCallTimeRef.current === null
          ? interval
          : now - lastCallTimeRef.current;

      lastArgsRef.current = args;

      // First call or enough time has passed
      if (timeSinceLastCall >= interval) {
        if (leading) {
          lastCallTimeRef.current = now;
          callbackRef.current(...args);
        } else {
          // Schedule for trailing edge
          lastCallTimeRef.current = now;
          if (trailing && !timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
              timeoutRef.current = null;
              if (lastArgsRef.current) {
                callbackRef.current(...lastArgsRef.current);
              }
            }, interval);
          }
        }
      } else if (trailing && !timeoutRef.current) {
        // Schedule trailing call
        const remainingTime = interval - timeSinceLastCall;
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          lastCallTimeRef.current = Date.now();
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
          }
        }, remainingTime);
      }
    },
    [interval, leading, trailing],
  );

  return [throttledCallback, cancel];
}
