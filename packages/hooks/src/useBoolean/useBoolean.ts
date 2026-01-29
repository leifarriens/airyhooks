import { useCallback, useState } from "react";

/**
 * Boolean state with setTrue, setFalse, and toggle handlers.
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
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [
    value,
    {
      setFalse,
      setTrue,
      toggle,
    },
  ];
}
