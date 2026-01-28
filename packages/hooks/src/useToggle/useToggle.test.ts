import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useBoolean, useToggle } from "./useToggle.js";

describe("useToggle", () => {
  it("should initialize with false by default", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it("should toggle value", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it("should set value directly", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[2](true);
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[2](false);
    });
    expect(result.current[0]).toBe(false);
  });
});

describe("useBoolean", () => {
  it("should initialize with false by default", () => {
    const { result } = renderHook(() => useBoolean());
    expect(result.current[0]).toBe(false);
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
});
