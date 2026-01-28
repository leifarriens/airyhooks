import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCounter } from "./useCounter.js";

describe("useCounter", () => {
  it("should initialize with 0 by default", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current[0]).toBe(0);
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current[0]).toBe(10);
  });

  it("should increment by 1 by default", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current[1].increment();
    });
    expect(result.current[0]).toBe(1);
  });

  it("should increment by custom amount", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current[1].increment(5);
    });
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1].increment(3);
    });
    expect(result.current[0]).toBe(8);
  });

  it("should decrement by 1 by default", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current[1].decrement();
    });
    expect(result.current[0]).toBe(4);
  });

  it("should decrement by custom amount", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current[1].decrement(3);
    });
    expect(result.current[0]).toBe(7);
  });

  it("should reset to initial value", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current[1].increment(10);
    });
    expect(result.current[0]).toBe(15);

    act(() => {
      result.current[1].reset();
    });
    expect(result.current[0]).toBe(5);
  });

  it("should set to specific value", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current[1].set(42);
    });
    expect(result.current[0]).toBe(42);
  });

  it("should set with updater function", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current[1].set((prev) => prev * 2);
    });
    expect(result.current[0]).toBe(20);
  });

  it("should handle negative numbers", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current[1].decrement(5);
    });
    expect(result.current[0]).toBe(-5);
  });
});
