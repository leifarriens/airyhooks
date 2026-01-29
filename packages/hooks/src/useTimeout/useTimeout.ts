import { useEffect } from "react";

/**
 * Calls a callback after a timeout.
 *
 * @param callback - Function to call after timeout
 * @param delay - Timeout delay in milliseconds (null to disable)
 *
 * @example
 * useTimeout(() => {
 *   console.log("Timeout completed");
 * }, 2000);
 *
 * @example
 * // Disable timeout by passing null
 * useTimeout(() => {
 *   console.log("This won't run");
 * }, null);
 */
export function useTimeout(callback: () => void, delay: null | number): void {
  useEffect(() => {
    if (delay === null) return;

    const timeout = setTimeout(callback, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [callback, delay]);
}
