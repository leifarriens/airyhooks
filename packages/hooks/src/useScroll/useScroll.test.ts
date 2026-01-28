import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useScroll, useScrollElement } from "./useScroll.js";

describe("useScroll", () => {
  it("should initialize with zero scroll position", () => {
    const { result } = renderHook(() => useScroll());
    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it("should update on window scroll", async () => {
    const { result } = renderHook(() => useScroll());

    act(() => {
      Object.defineProperty(window, "scrollX", {
        value: 100,
        writable: true,
      });
      Object.defineProperty(window, "scrollY", {
        value: 200,
        writable: true,
      });
      const scrollEvent = new Event("scroll");
      window.dispatchEvent(scrollEvent);
    });

    await waitFor(() => {
      expect(result.current.x).toBe(100);
      expect(result.current.y).toBe(200);
    });
  });

  it("should track element scroll when ref is provided", () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollLeft: 50,
      scrollTop: 100,
    } as unknown as HTMLElement;

    const ref = { current: mockElement };
    const { result } = renderHook(() => useScroll(ref));

    expect(typeof result.current).toBe("object");
    expect("x" in result.current && "y" in result.current).toBe(true);
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScroll());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });
});

describe("useScrollElement", () => {
  it("should return ref and scroll position", () => {
    const { result } = renderHook(() => useScrollElement<HTMLDivElement>());

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toHaveProperty("current");
    expect(typeof result.current[1].x).toBe("number");
    expect(typeof result.current[1].y).toBe("number");
  });

  it("should provide ref for element scroll tracking", () => {
    const { result } = renderHook(() => useScrollElement<HTMLDivElement>());
    const [ref, scroll] = result.current;

    expect(ref).toBeDefined();
    expect(typeof scroll.x).toBe("number");
    expect(typeof scroll.y).toBe("number");
  });
});
