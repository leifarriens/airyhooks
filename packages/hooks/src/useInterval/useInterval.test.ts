import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInterval } from "./useInterval.js";

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

  it("should not reset the interval when the callback changes", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();
    const { rerender } = renderHook(
      ({ callback }: { callback: () => void }) => {
        useInterval(callback, 1000);
      },
      { initialProps: { callback: firstCallback } },
    );

    vi.advanceTimersByTime(500);
    rerender({ callback: secondCallback });
    vi.advanceTimersByTime(500);

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it("should pause when delay is null", () => {
    const callback = vi.fn();
    const initialProps: { delay: null | number } = { delay: 1000 };
    const { rerender } = renderHook(
      ({ delay }: { delay: null | number }) => {
        useInterval(callback, delay);
      },
      { initialProps },
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
