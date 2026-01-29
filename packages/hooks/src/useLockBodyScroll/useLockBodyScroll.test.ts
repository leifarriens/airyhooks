import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useLockBodyScroll } from "./useLockBodyScroll.js";

describe("useLockBodyScroll", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  it("should lock body scroll by default", () => {
    renderHook(() => {
      useLockBodyScroll();
    });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should lock body scroll when lock is true", () => {
    renderHook(() => {
      useLockBodyScroll(true);
    });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should not lock body scroll when lock is false", () => {
    renderHook(() => {
      useLockBodyScroll(false);
    });

    expect(document.body.style.overflow).toBe("");
  });

  it("should restore original overflow on unmount", () => {
    document.body.style.overflow = "auto";

    const { unmount } = renderHook(() => {
      useLockBodyScroll();
    });

    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("should toggle lock when lock parameter changes", () => {
    const { rerender } = renderHook(
      ({ lock }) => {
        useLockBodyScroll(lock);
      },
      {
        initialProps: { lock: false },
      },
    );

    expect(document.body.style.overflow).toBe("");

    rerender({ lock: true });
    expect(document.body.style.overflow).toBe("hidden");

    rerender({ lock: false });
    expect(document.body.style.overflow).toBe("");
  });

  it("should handle empty string as original overflow", () => {
    document.body.style.overflow = "";

    const { unmount } = renderHook(() => {
      useLockBodyScroll();
    });

    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("should preserve scroll-y overflow style", () => {
    document.body.style.overflow = "scroll";

    const { unmount } = renderHook(() => {
      useLockBodyScroll();
    });

    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });
});
