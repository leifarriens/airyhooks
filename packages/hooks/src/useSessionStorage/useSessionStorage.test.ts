import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useSessionStorage } from "./useSessionStorage.js";

describe("useSessionStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("should initialize with initial value", () => {
    const { result } = renderHook(() => useSessionStorage("test", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should read from sessionStorage if key exists", () => {
    sessionStorage.setItem("test", JSON.stringify("stored"));
    const { result } = renderHook(() => useSessionStorage("test", "initial"));
    expect(result.current[0]).toBe("stored");
  });

  it("should update sessionStorage when value changes", () => {
    const { result } = renderHook(() => useSessionStorage("test", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(sessionStorage.getItem("test")).toBe(JSON.stringify("updated"));
  });

  it("should support updater function", () => {
    const { result } = renderHook(() => useSessionStorage("test", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should remove value from sessionStorage", () => {
    sessionStorage.setItem("test", JSON.stringify("value"));
    const { result } = renderHook(() => useSessionStorage("test", "initial"));

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("initial");
    expect(sessionStorage.getItem("test")).toBeNull();
  });

  it("should use the latest fallback for a changed key", () => {
    const { rerender, result } = renderHook(
      ({ initialValue, key }) => useSessionStorage(key, initialValue),
      { initialProps: { initialValue: "first-default", key: "firstKey" } },
    );

    rerender({ initialValue: "second-default", key: "secondKey" });
    expect(result.current[0]).toBe("second-default");
  });

  it("should return the fallback when sessionStorage access throws", () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      window,
      "sessionStorage",
    );
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
    });

    try {
      const { rerender, result } = renderHook(
        ({ key }) => useSessionStorage(key, "fallback"),
        { initialProps: { key: "first" } },
      );

      expect(result.current[0]).toBe("fallback");
      rerender({ key: "second" });
      expect(result.current[0]).toBe("fallback");
      expect(warnSpy).toHaveBeenCalled();
    } finally {
      if (descriptor) {
        Object.defineProperty(window, "sessionStorage", descriptor);
      }
      warnSpy.mockRestore();
    }
  });

  it("should load the value for a changed key", () => {
    sessionStorage.setItem("firstKey", JSON.stringify("first"));
    sessionStorage.setItem("secondKey", JSON.stringify("second"));

    const { rerender, result } = renderHook(
      ({ key }) => useSessionStorage(key, "default"),
      { initialProps: { key: "firstKey" } },
    );

    expect(result.current[0]).toBe("first");
    rerender({ key: "secondKey" });
    expect(result.current[0]).toBe("second");
  });

  it("should handle complex objects", () => {
    const obj = { name: "test", value: 42 };
    const { result } = renderHook(() => useSessionStorage("test", obj));

    act(() => {
      result.current[1]({ name: "updated", value: 100 });
    });

    expect(result.current[0]).toEqual({ name: "updated", value: 100 });
    expect(JSON.parse(sessionStorage.getItem("test") ?? "{}")).toEqual({
      name: "updated",
      value: 100,
    });
  });

  it("should handle parse errors gracefully", () => {
    sessionStorage.setItem("test", "invalid json");
    const { result } = renderHook(() => useSessionStorage("test", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });
});
