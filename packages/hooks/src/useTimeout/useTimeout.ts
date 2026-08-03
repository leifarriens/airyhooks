import { useEffect, useRef } from "react";

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
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const timeout = setTimeout(() => {
      callbackRef.current();
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);
}
