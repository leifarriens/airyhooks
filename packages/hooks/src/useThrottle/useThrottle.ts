import { useEffect, useRef, useState } from "react";

/**
 * Throttles a value to update at most once per specified interval.
 *
 * @param value - The value to throttle
 * @param interval - The throttle interval in milliseconds (default: 500ms)
 * @returns The throttled value
 *
 * @example
 * const [position, setPosition] = useState({ x: 0, y: 0 });
 * const throttledPosition = useThrottle(position, 100);
 *
 * useEffect(() => {
 *   // This effect runs at most every 100ms
 *   updateCursor(throttledPosition);
 * }, [throttledPosition]);
 */
export function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - elapsed);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, interval]);

  return throttledValue;
}
