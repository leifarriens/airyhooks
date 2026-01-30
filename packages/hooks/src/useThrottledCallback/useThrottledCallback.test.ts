import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useThrottledCallback } from "./useThrottledCallback.js";

describe("useThrottledCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should execute immediately on first call (leading edge)", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 500));

    const [throttledCallback] = result.current;

    act(() => {
      throttledCallback("first");
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first");
  });

  it("should throttle subsequent calls within interval", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 500));

    const [throttledCallback] = result.current;

    act(() => {
      throttledCallback("a");
      throttledCallback("b");
      throttledCallback("c");
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("a");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Trailing call with last args
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("c");
  });

  it("should use default interval of 500ms", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback));

    const [throttledCallback] = result.current;

    act(() => {
      throttledCallback("first");
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      throttledCallback("second");
    });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should allow calls after interval has passed", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 500));

    const [throttledCallback] = result.current;

    act(() => {
      throttledCallback("first");
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      throttledCallback("second");
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("second");
  });

  it("should cancel pending callback", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 500));

    const [throttledCallback, cancel] = result.current;

    act(() => {
      throttledCallback("first");
      throttledCallback("second");
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      cancel();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Trailing call was cancelled
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should pass all arguments to callback", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(callback, 100));

    const [throttledCallback] = result.current;

    act(() => {
      throttledCallback("arg1", "arg2", 123);
    });

    expect(callback).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  it("should use latest callback reference", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender, result } = renderHook(
      ({ cb }) => useThrottledCallback(cb, 500),
      { initialProps: { cb: callback1 } },
    );

    const [throttledCallback] = result.current;

    act(() => {
      throttledCallback("first");
      throttledCallback("second");
    });

    expect(callback1).toHaveBeenCalledTimes(1);

    rerender({ cb: callback2 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Trailing call uses new callback
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should cleanup on unmount", () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() =>
      useThrottledCallback(callback, 500),
    );

    const [throttledCallback] = result.current;

    act(() => {
      throttledCallback("first");
      throttledCallback("second");
    });

    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Trailing call was cleaned up
    expect(callback).toHaveBeenCalledTimes(1);
  });

  describe("options", () => {
    it("should not execute immediately when leading is false", () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        useThrottledCallback(callback, 500, { leading: false }),
      );

      const [throttledCallback] = result.current;

      act(() => {
        throttledCallback("first");
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("first");
    });

    it("should not execute trailing call when trailing is false", () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        useThrottledCallback(callback, 500, { trailing: false }),
      );

      const [throttledCallback] = result.current;

      act(() => {
        throttledCallback("first");
        throttledCallback("second");
        throttledCallback("third");
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("first");

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // No trailing call
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle both leading and trailing as false gracefully", () => {
      const callback = vi.fn();
      const { result } = renderHook(() =>
        useThrottledCallback(callback, 500, {
          leading: false,
          trailing: false,
        }),
      );

      const [throttledCallback] = result.current;

      act(() => {
        throttledCallback("test");
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // No calls when both are false
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
