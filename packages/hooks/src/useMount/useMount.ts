import { useEffect } from "react";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only run on mount
  useEffect(callback, []);
}
