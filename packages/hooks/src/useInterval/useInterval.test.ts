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
