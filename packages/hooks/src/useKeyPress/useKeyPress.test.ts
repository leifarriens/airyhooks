import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useKeyPress } from "./useKeyPress.js";

describe("useKeyPress", () => {
  it("should initialize with false", () => {
    const { result } = renderHook(() => useKeyPress("Enter"));
    expect(result.current).toBe(false);
  });

  it("should set to true on keydown", async () => {
    const { result } = renderHook(() => useKeyPress("Enter"));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      window.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("should set to false on keyup", async () => {
    const { result } = renderHook(() => useKeyPress("Enter"));

    act(() => {
      const downEvent = new KeyboardEvent("keydown", { key: "Enter" });
      window.dispatchEvent(downEvent);
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    act(() => {
      const upEvent = new KeyboardEvent("keyup", { key: "Enter" });
      window.dispatchEvent(upEvent);
    });

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("should ignore other keys", () => {
    const { result } = renderHook(() => useKeyPress("Enter"));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "a" });
      window.dispatchEvent(event);
    });

    // Should still be false
    expect(result.current).toBe(false);
  });

  it("should work with different keys", async () => {
    const { result: resultA } = renderHook(() => useKeyPress("ArrowUp"));
    const { result: resultEnter } = renderHook(() => useKeyPress("Enter"));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
      window.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(resultA.current).toBe(true);
      expect(resultEnter.current).toBe(false);
    });
  });

  it("should handle space key", async () => {
    const { result } = renderHook(() => useKeyPress(" "));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: " " });
      window.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("should clean up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useKeyPress("Enter"));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keyup",
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });
});
