import { useEffect, useRef } from "react";

/**
 * Tracks the previous value or prop.
 *
 * @param value - The current value to track
 * @returns The previous value from the last render
 *
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 *
 * useEffect(() => {
 *   console.log(`Current: ${count}, Previous: ${prevCount}`);
 * }, [count, prevCount]);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
