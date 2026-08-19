import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Syncs state with localStorage, persisting across browser sessions.
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value (used if no stored value exists)
 * @returns A tuple of [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light");
 *
 * // Update the theme (automatically persisted)
 * setTheme("dark");
 *
 * // Remove from localStorage
 * removeTheme();
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: ((prev: T) => T) | T) => void, () => void] {
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    return readStoredValue(key, initialValue);
  });

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: ((prev: T) => T) | T) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key && event.key !== null) {
        return;
      }

      if (event.newValue === null) {
        setStoredValue(initialValueRef.current);
        return;
      }

      try {
        setStoredValue(JSON.parse(event.newValue) as T);
      } catch (error) {
        console.warn(`Error parsing localStorage key "${key}":`, error);
      }
    };

    // Reload the value when the key changes.
    setStoredValue(readStoredValue(key, initialValueRef.current));
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}

function readStoredValue<T>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item === null ? initialValue : (JSON.parse(item) as T);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}
