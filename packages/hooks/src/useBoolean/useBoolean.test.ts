import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useBoolean } from "./useBoolean.js";

describe("useBoolean", () => {
  it("should initialize with false by default", () => {
    const { result } = renderHook(() => useBoolean());
    expect(result.current[0]).toBe(false);
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useBoolean(true));
    expect(result.current[0]).toBe(true);
  });

  it("should have setTrue handler", () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current[1].setTrue();
    });
    expect(result.current[0]).toBe(true);
  });

  it("should have setFalse handler", () => {
    const { result } = renderHook(() => useBoolean(true));

    act(() => {
      result.current[1].setFalse();
    });
    expect(result.current[0]).toBe(false);
  });

  it("should have toggle handler", () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(false);
  });

  it("should maintain stable handler references", () => {
    const { rerender, result } = renderHook(() => useBoolean());

    const handlers1 = result.current[1];
    rerender();
    const handlers2 = result.current[1];

    expect(handlers1.toggle).toBe(handlers2.toggle);
    expect(handlers1.setTrue).toBe(handlers2.setTrue);
    expect(handlers1.setFalse).toBe(handlers2.setFalse);
  });
});
