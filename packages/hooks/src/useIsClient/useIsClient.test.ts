import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useIsClient } from "./useIsClient.js";

describe("useIsClient", () => {
  it("should return true after mount", () => {
    const { result } = renderHook(() => useIsClient());

    // After the initial render and useEffect, isClient should be true
    expect(result.current).toBe(true);
  });

  it("should return consistent value across re-renders", () => {
    const { rerender, result } = renderHook(() => useIsClient());

    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(true);
  });
});
