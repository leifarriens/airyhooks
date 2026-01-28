import { useEffect } from "react";

/**
 * Re-renders component at specified interval.
 *
 * @param callback - Function to call on each interval
 * @param delay - Interval delay in milliseconds (null to pause)
 *
 * @example
 * useInterval(() => {
 *   setTime(new Date());
 * }, 1000);
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

/**
 * Re-renders component after a timeout.
 *
 * @param callback - Function to call after timeout
 * @param delay - Timeout delay in milliseconds
 *
 * @example
 * useTimeout(() => {
 *   console.log("Timeout completed");
 * }, 2000);
 */
export function useTimeout(callback: () => void, delay: number): void {
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [callback, delay]);
}
