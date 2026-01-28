import { useEffect, useRef } from "react";

/**
 * Calls a callback on component mount.
 *
 * @param callback - Function to call on mount
 *
 * @example
 * useMount(() => {
 *   console.log("Component mounted");
 *   // Initialize resources
 * });
 */
export function useMount(callback: () => void): void {
  useEffect(callback, []);
}

/**
 * Calls a callback on component unmount.
 *
 * @param callback - Function to call on unmount
 *
 * @example
 * useUnmount(() => {
 *   console.log("Component unmounting");
 *   // Cleanup resources
 * });
 */
export function useUnmount(callback: () => void): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}
