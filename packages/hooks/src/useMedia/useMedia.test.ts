import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMedia } from "./useMedia.js";

describe("useMedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with false for non-matching query", () => {
    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: false,
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    const { result } = renderHook(() => useMedia("(max-width: 480px)"));
    expect(result.current).toBe(false);
  });

  it("should match media query", () => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: true,
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    const { result } = renderHook(() => useMedia("(min-width: 0px)"));
    expect(result.current).toBe(true);
  });

  it("should update on media query change", async () => {
    let listenerFn: ((e: MediaQueryListEvent) => void) | null = null;

    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        addEventListener: vi.fn(
          (_: string, fn: (e: MediaQueryListEvent) => void) => {
            listenerFn = fn;
          },
        ),
        matches: false,
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    const { result } = renderHook(() => useMedia("(max-width: 768px)"));
    expect(result.current).toBe(false);

    // Trigger the change listener
    expect(listenerFn).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    listenerFn!({
      matches: true,
      media: "(max-width: 768px)",
    } as unknown as MediaQueryListEvent);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("should handle invalid media query gracefully", () => {
    const consoleSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => {
        throw new Error("Invalid media query");
      }),
      writable: true,
    });

    const { result } = renderHook(() => useMedia("invalid()"));
    expect(result.current).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should work with prefers-color-scheme", () => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: false,
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    const { result } = renderHook(() =>
      useMedia("(prefers-color-scheme: dark)"),
    );
    expect(typeof result.current).toBe("boolean");
  });

  it("should update when query changes", () => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: false,
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    const { rerender, result } = renderHook(({ query }) => useMedia(query), {
      initialProps: { query: "(max-width: 768px)" },
    });

    rerender({ query: "(max-width: 480px)" });

    expect(typeof result.current).toBe("boolean");
  });

  it("should clean up listeners on unmount", () => {
    const mockRemoveEventListener = vi.fn();

    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: false,
        removeEventListener: mockRemoveEventListener,
      })),
      writable: true,
    });

    const { unmount } = renderHook(() => useMedia("(max-width: 768px)"));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
