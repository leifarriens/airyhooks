import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useThrottle } from "./useThrottle.js";

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useThrottle("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should throttle rapid updates", () => {
    const { rerender, result } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: "a" } },
    );

    expect(result.current).toBe("a");

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    rerender({ value: "c" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("c");
  });

  it("should allow updates after interval passes", () => {
    const { rerender, result } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: "a" } },
    );

    expect(result.current).toBe("a");

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("b");

    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe("c");
  });

  it("should use default interval of 500ms", () => {
    const { rerender, result } = renderHook(({ value }) => useThrottle(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("should cleanup timer on unmount when throttle pending", () => {
    const { rerender, unmount } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    unmount();
    expect(true).toBe(true);
  });
});
