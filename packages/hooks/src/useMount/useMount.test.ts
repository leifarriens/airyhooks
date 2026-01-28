import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMount, useUnmount } from "./useMount.js";

describe("useMount", () => {
  it("should call callback on mount", () => {
    const callback = vi.fn();
    renderHook(() => {
      useMount(callback);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback on rerender", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => {
      useMount(callback);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

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
});
