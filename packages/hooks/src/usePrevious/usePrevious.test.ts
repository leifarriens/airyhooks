import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePrevious } from "./usePrevious.js";

describe("usePrevious", () => {
  it("should return undefined on first render", () => {
    const { result } = renderHook(() => usePrevious(5));
    expect(result.current).toBeUndefined();
  });

  it("should return previous value on subsequent renders", () => {
    const { rerender, result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    expect(result.current).toBeUndefined();

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  it("should work with different types", () => {
    const obj = { name: "Alice" };
    const { rerender, result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj },
    });

    expect(result.current).toBeUndefined();

    const newObj = { name: "Bob" };
    rerender({ value: newObj });
    expect(result.current).toBe(obj);
  });
});
