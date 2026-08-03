import { useCallback, useEffect, useRef, useState } from "react";

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
  const initialValueRef = useRef(initialValue);

  // Get initial value from sessionStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    return readStoredValue(window.sessionStorage, key, initialValue);
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

  useEffect(() => {
    // Reload the value when the key changes.
    setStoredValue(
      readStoredValue(window.sessionStorage, key, initialValueRef.current),
    );
  }, [key]);

  return [storedValue, setValue, removeValue];
}

function readStoredValue<T>(storage: Storage, key: string, initialValue: T): T {
  try {
    const item = storage.getItem(key);
    return item === null ? initialValue : (JSON.parse(item) as T);
  } catch (error) {
    console.warn(`Error reading sessionStorage key "${key}":`, error);
    return initialValue;
  }
}
