import { useCallback, useState } from "react";

/**
 * Syncs state with sessionStorage, persisting only for the current session.
 *
 * @param key - The sessionStorage key
 * @param initialValue - The initial value (used if no stored value exists)
 * @returns A tuple of [value, setValue, removeValue]
 *
 * @example
 * const [sessionData, setSessionData, removeSessionData] = useSessionStorage("session", "default");
 *
 * // Update the session data (automatically persisted)
 * setSessionData("newData");
 *
 * // Remove from sessionStorage
 * removeSessionData();
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: ((prev: T) => T) | T) => void, () => void] {
  // Get initial value from sessionStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update sessionStorage when value changes
  const setValue = useCallback(
    (value: ((prev: T) => T) | T) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key],
  );

  // Remove from sessionStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
