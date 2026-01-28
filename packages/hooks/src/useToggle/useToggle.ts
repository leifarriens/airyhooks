import { useCallback, useState } from "react";

/**
 * Alias for useToggle with boolean semantics.
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns Tuple of [value, { setTrue, setFalse, toggle }]
 *
 * @example
 * const [isEnabled, handlers] = useBoolean(false);
 *
 * return (
 *   <>
 *     <button onClick={handlers.toggle}>Toggle</button>
 *     <button onClick={handlers.setTrue}>Enable</button>
 *     <button onClick={handlers.setFalse}>Disable</button>
 *   </>
 * );
 */
export function useBoolean(initialValue = false): [
  boolean,
  {
    setFalse: () => void;
    setTrue: () => void;
    toggle: () => void;
  },
] {
  const [value, toggle, setValue] = useToggle(initialValue);

  return [
    value,
    {
      setFalse: useCallback(() => {
        setValue(false);
      }, [setValue]),
      setTrue: useCallback(() => {
        setValue(true);
      }, [setValue]),
      toggle,
    },
  ];
}

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
