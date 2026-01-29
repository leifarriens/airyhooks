import type { MockInstance } from "vitest";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { registry } from "../utils/registry.js";
import { list } from "./list.js";

function getConsoleOutput(
  spy: MockInstance<(message?: unknown) => void>,
): string {
  return spy.mock.calls.map((call) => String(call[0])).join("\n");
}

describe("list", () => {
  let consoleSpy: MockInstance<(message?: unknown) => void>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should log available hooks header", () => {
    list();

    expect(consoleSpy).toHaveBeenCalled();
    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("Available hooks");
  });

  it("should log all hooks from registry", () => {
    list();

    const allCalls = getConsoleOutput(consoleSpy);

    for (const hook of registry) {
      expect(allCalls).toContain(hook.name);
    }
  });

  it("should log hook descriptions", () => {
    list();

    const allCalls = getConsoleOutput(consoleSpy);

    for (const hook of registry) {
      expect(allCalls).toContain(hook.description);
    }
  });

  it("should log usage instructions", () => {
    list();

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("airyhooks add");
  });
});
