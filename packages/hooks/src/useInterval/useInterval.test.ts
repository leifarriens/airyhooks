import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInterval, useTimeout } from "./useInterval.js";

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call callback at interval", () => {
    const callback = vi.fn();
    renderHook(() => {
      useInterval(callback, 1000);
    });

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should pause when delay is null", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ delay }: { delay: null | number }) => {
        useInterval(callback, delay);
      },
      { initialProps: { delay: 1000 as null | number } },
    );

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ delay: null });

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cleanup interval on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => {
      useInterval(callback, 1000);
    });

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

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
});
