import { describe, expect, it } from "vitest";

import { getHookTemplate, getHookTestTemplate } from "./get-hook-template.js";

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

describe("getHookTestTemplate", () => {
  it("should return test template for existing hook", () => {
    const template = getHookTestTemplate("useBoolean");

    expect(template).toContain("describe");
  });

  it("should throw error for non-existent hook", () => {
    expect(() => getHookTestTemplate("useNonExistent")).toThrow(
      'Test template for hook "useNonExistent" not found',
    );
  });
});
