import { describe, expect, test } from "vitest";

import { getHookFileBaseName } from "./get-hook-filename.js";

describe("getHookFileBaseName", () => {
  test.each([
    {
      use: "use",
      useDebounce: "use-debounce",
      useIsPrimed: "use-is-primed",
    },
  ])("should format camelCase to kebab-case", (cases) => {
    for (const [input, expected] of Object.entries(cases)) {
      const result = getHookFileBaseName(input, "kebab-case");

      expect(result).toBe(expected);
    }
  });

  test.each([
    {
      use: "use",
      useDebounce: "useDebounce",
      useIsPrimed: "useIsPrimed",
    },
  ])("should format camelCase to kebab-case", (cases) => {
    for (const [input, expected] of Object.entries(cases)) {
      const result = getHookFileBaseName(input, "camelCase");

      expect(result).toBe(expected);
    }
  });
});
