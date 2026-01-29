import { useCallback, useState } from "react";

/**
 * Toggle a boolean value with a callback.
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns Tuple of [value, toggle, setValue]
 *
 * @example
 * const [isOpen, toggle] = useToggle(false);
 *
 * return (
 *   <>
 *     <button onClick={toggle}>Toggle</button>
 *     {isOpen && <div>Content</div>}
 *   </>
 * );
 */
export function useToggle(
  initialValue = false,
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
