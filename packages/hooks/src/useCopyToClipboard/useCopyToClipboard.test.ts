import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCopyToClipboard } from "./useCopyToClipboard.js";

describe("useCopyToClipboard", () => {
  const mockClipboard = {
    writeText: vi.fn(),
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state with null copiedText", () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current.copiedText).toBeNull();
    expect(typeof result.current.copy).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("should copy text to clipboard and update state", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      const success = await result.current.copy("Hello, World!");
      expect(success).toBe(true);
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith("Hello, World!");
    expect(result.current.copiedText).toBe("Hello, World!");
  });

  it("should reset copiedText state", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("Test");
    });
    expect(result.current.copiedText).toBe("Test");

    act(() => {
      result.current.reset();
    });
    expect(result.current.copiedText).toBeNull();
  });

  it("should return false when clipboard API fails", async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error("Failed"));
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      const success = await result.current.copy("Test");
      expect(success).toBe(false);
    });

    expect(result.current.copiedText).toBeNull();
    consoleSpy.mockRestore();
  });

  it("should return false when clipboard API is not available", async () => {
    Object.assign(navigator, { clipboard: undefined });
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      const success = await result.current.copy("Test");
      expect(success).toBe(false);
    });

    consoleSpy.mockRestore();
  });

  it("should update copiedText on subsequent copies", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy("First");
    });
    expect(result.current.copiedText).toBe("First");

    await act(async () => {
      await result.current.copy("Second");
    });
    expect(result.current.copiedText).toBe("Second");
  });
});
