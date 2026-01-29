import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useTimeout } from "./useTimeout.js";

describe("useTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call callback after timeout", () => {
    const callback = vi.fn();
    renderHook(() => {
      useTimeout(callback, 2000);
    });

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cleanup timeout on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => {
      useTimeout(callback, 2000);
    });

    unmount();

    vi.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not set timeout when delay is null", () => {
    const callback = vi.fn();
    renderHook(() => {
      useTimeout(callback, null);
    });

    vi.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should reset timeout when delay changes", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ delay }: { delay: null | number }) => {
        useTimeout(callback, delay);
      },
      { initialProps: { delay: 2000 as null | number } },
    );

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();

    // Change delay, should reset the timeout
    rerender({ delay: 3000 });

    vi.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
