import type { MockInstance } from "vitest";

import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { parseCommandOptions } from "./parse-command-options.js";

describe("parseCommandOptions", () => {
  let exitSpy: MockInstance<(code?: number) => never>;

  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((code?: null | number | string) => {
        throw new Error(`process.exit(${String(code)})`);
      });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return parsed options when valid", () => {
    const options = parseCommandOptions(
      v.object({
        name: v.string(),
      }),
      { name: "test" },
    );

    expect(exitSpy).not.toHaveBeenCalled();
    expect(options).toEqual({ name: "test" });
  });

  it("should exit process when options are invalid", () => {
    expect(() =>
      parseCommandOptions(
        v.object({
          name: v.string(),
        }),
        { test: true },
      ),
    ).toThrow("process.exit(1)");

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should handle root-level validation errors", () => {
    // Using v.string() directly means the error has no path (root level)
    expect(() => parseCommandOptions(v.string(), 123)).toThrow(
      "process.exit(1)",
    );

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
