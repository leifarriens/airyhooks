import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useUnmount } from "./useUnmount.js";

describe("useUnmount", () => {
  it("should call callback on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => {
      useUnmount(callback);
    });

    expect(callback).not.toHaveBeenCalled();

    unmount();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback on rerender", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => {
      useUnmount(callback);
    });

    rerender();
    expect(callback).not.toHaveBeenCalled();
  });

  it("should use latest callback on unmount", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender, unmount } = renderHook(
      ({ cb }: { cb: () => void }) => {
        useUnmount(cb);
      },
      { initialProps: { cb: callback1 } },
    );

    rerender({ cb: callback2 });
    unmount();

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
