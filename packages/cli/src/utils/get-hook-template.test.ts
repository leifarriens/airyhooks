import { describe, expect, it } from "vitest";

import { getHookTemplate } from "./get-hook-template.js";

describe("getHookTemplate", () => {
  it("should return template for existing hook", () => {
    const template = getHookTemplate("useBoolean");

    expect(template).toContain("export function useBoolean");
  });

  it("should throw error for non-existent hook", () => {
    expect(() => getHookTemplate("useNonExistent")).toThrow(
      'Template for hook "useNonExistent" not found',
    );
  });
});
