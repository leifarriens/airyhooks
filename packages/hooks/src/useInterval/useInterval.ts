import { useEffect } from "react";

/**
 * Calls a callback at specified intervals.
 *
 * @param callback - Function to call on each interval
 * @param delay - Interval delay in milliseconds (null to pause)
 *
 * @example
 * useInterval(() => {
 *   setTime(new Date());
 * }, 1000);
 *
 * @example
 * // Pause interval by passing null
 * useInterval(callback, isPaused ? null : 1000);
 */
export function useInterval(callback: () => void, delay: null | number): void {
  useEffect(() => {
    if (delay === null) return;

    const interval = setInterval(callback, delay);
    return () => {
      clearInterval(interval);
    };
  }, [callback, delay]);
}
