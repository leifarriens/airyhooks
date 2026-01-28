import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

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
