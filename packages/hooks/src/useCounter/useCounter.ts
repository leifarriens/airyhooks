import { useCallback, useState } from "react";

/**
 * Manages numeric state with increment, decrement, reset, and set methods.
 *
 * @param initialValue - Initial numeric value (default: 0)
 * @returns Tuple of [value, { increment, decrement, reset, set }]
 *
 * @example
 * const [count, { increment, decrement, reset }] = useCounter(0);
 *
 * return (
 *   <>
 *     <p>Count: {count}</p>
 *     <button onClick={() => increment()}>+1</button>
 *     <button onClick={() => decrement()}>-1</button>
 *     <button onClick={() => increment(5)}>+5</button>
 *     <button onClick={() => reset()}>Reset</button>
 *   </>
 * );
 */
export function useCounter(initialValue = 0): [
  number,
  {
    decrement: (amount?: number) => void;
    increment: (amount?: number) => void;
    reset: () => void;
    set: (value: ((prev: number) => number) | number) => void;
  },
] {
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback((amount = 1) => {
    setCount((prev) => prev + amount);
  }, []);

  const decrement = useCallback((amount = 1) => {
    setCount((prev) => prev - amount);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value: ((prev: number) => number) | number) => {
    setCount(value);
  }, []);

  return [
    count,
    {
      decrement,
      increment,
      reset,
      set,
    },
  ];
}
