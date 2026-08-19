import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useLocalStorage } from "./useLocalStorage.js";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    expect(result.current[0]).toBe("defaultValue");
  });

  it("should return stored value from localStorage", () => {
    localStorage.setItem("testKey", JSON.stringify("storedValue"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    expect(result.current[0]).toBe("storedValue");
  });

  it("should update value and localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    act(() => {
      result.current[1]("newValue");
    });

    expect(result.current[0]).toBe("newValue");
    expect(localStorage.getItem("testKey")).toBe(JSON.stringify("newValue"));
  });

  it("should support function updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it("should remove value from localStorage", () => {
    localStorage.setItem("testKey", JSON.stringify("storedValue"));

    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("defaultValue");
    expect(localStorage.getItem("testKey")).toBeNull();
  });

  it("should handle complex objects", () => {
    const initialValue = { age: 30, name: "John" };

    const { result } = renderHook(() => useLocalStorage("user", initialValue));

    expect(result.current[0]).toEqual(initialValue);

    const newValue = { age: 25, name: "Jane" };
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toEqual(newValue);
    const storedValue = localStorage.getItem("user");
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue ?? "")).toEqual(newValue);
  });

  it("should handle arrays", () => {
    const { result } = renderHook(() => useLocalStorage<string[]>("items", []));

    act(() => {
      result.current[1](["a", "b", "c"]);
    });

    expect(result.current[0]).toEqual(["a", "b", "c"]);
  });

  it("should handle parse errors when reading from localStorage", () => {
    localStorage.setItem("badKey", "invalid json");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

    const { result } = renderHook(() =>
      useLocalStorage("badKey", "defaultValue"),
    );

    expect(result.current[0]).toBe("defaultValue");
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should handle parse errors in storage event", () => {
    renderHook(() => useLocalStorage("testKey", "defaultValue"));

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

    act(() => {
      const event = new StorageEvent("storage", {
        key: "testKey",
        newValue: "invalid json",
      });
      window.dispatchEvent(event);
    });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should ignore storage events for different keys", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "otherKey",
        newValue: JSON.stringify("value"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("defaultValue");
  });

  it("should reset when a storage item is removed elsewhere", () => {
    localStorage.setItem("testKey", JSON.stringify("storedValue"));
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "testKey",
        newValue: null,
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("defaultValue");
  });

  it("should use the latest fallback for a changed key and storage deletion", () => {
    const { rerender, result } = renderHook(
      ({ initialValue, key }) => useLocalStorage(key, initialValue),
      { initialProps: { initialValue: "first-default", key: "firstKey" } },
    );

    rerender({ initialValue: "second-default", key: "secondKey" });
    expect(result.current[0]).toBe("second-default");

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "secondKey", newValue: null }),
      );
    });
    expect(result.current[0]).toBe("second-default");
  });

  it("should return the fallback when localStorage access throws", () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
    });

    try {
      const { rerender, result } = renderHook(
        ({ key }) => useLocalStorage(key, "fallback"),
        { initialProps: { key: "first" } },
      );

      expect(result.current[0]).toBe("fallback");
      rerender({ key: "second" });
      expect(result.current[0]).toBe("fallback");
      expect(warnSpy).toHaveBeenCalled();
    } finally {
      if (descriptor) {
        Object.defineProperty(window, "localStorage", descriptor);
      }
      warnSpy.mockRestore();
    }
  });

  it("should load the value for a changed key", () => {
    localStorage.setItem("firstKey", JSON.stringify("first"));
    localStorage.setItem("secondKey", JSON.stringify("second"));

    const { rerender, result } = renderHook(
      ({ key }) => useLocalStorage(key, "default"),
      { initialProps: { key: "firstKey" } },
    );

    expect(result.current[0]).toBe("first");
    rerender({ key: "secondKey" });
    expect(result.current[0]).toBe("second");
  });

  it("should handle updates from other tabs/windows", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "testKey",
        newValue: JSON.stringify("valueFromOtherTab"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("valueFromOtherTab");
  });

  it("should cleanup event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useLocalStorage("testKey", "defaultValue"),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "storage",
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });
});

it("should handle initial read with null value", () => {
  const { result } = renderHook(() =>
    useLocalStorage("nullKey", "defaultValue"),
  );

  expect(result.current[0]).toBe("defaultValue");
});

it("should handle edge case with empty string key", () => {
  const { result } = renderHook(() => useLocalStorage("", "defaultValue"));

  act(() => {
    result.current[1]("newValue");
  });

  expect(result.current[0]).toBe("newValue");
});
