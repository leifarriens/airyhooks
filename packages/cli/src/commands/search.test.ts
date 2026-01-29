import type { MockInstance } from "vitest";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { search } from "./search.js";

function getConsoleOutput(
  spy: MockInstance<(message?: unknown) => void>,
): string {
  return spy.mock.calls.map((call) => String(call[0])).join("\n");
}

describe("search", () => {
  let consoleSpy: MockInstance<(message?: unknown) => void>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should find hooks by exact name match", () => {
    search("useDebounce");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("useDebounce");
  });

  it("should find hooks by partial name match", () => {
    search("Debounce");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("useDebounce");
  });

  it("should find hooks by description match", () => {
    search("delay");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("useDebounce");
  });

  it("should be case-insensitive when searching by name", () => {
    search("USEDEBOUNCE");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("useDebounce");
  });

  it("should be case-insensitive when searching by description", () => {
    search("DELAY");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("useDebounce");
  });

  it("should return multiple hooks when query matches several", () => {
    search("use");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("useDebounce");
    expect(output).toContain("useBoolean");
    expect(output).toContain("useToggle");
  });

  it("should show no hooks when query does not match", () => {
    search("nonexistenthook");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain('No hooks found matching "nonexistenthook"');
    expect(output).not.toContain("useDebounce");
    expect(output).not.toContain("useBoolean");
  });

  it("should always display usage instructions", () => {
    search("useDebounce");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("Usage: airyhooks add <hook-name>");
  });

  it("should display usage instructions even when no hooks match", () => {
    search("nonexistenthook");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("Usage: airyhooks add <hook-name>");
  });

  it("should display hook description for matched hooks", () => {
    search("useBoolean");

    const output = getConsoleOutput(consoleSpy);
    expect(output).toContain("useBoolean");
    expect(output).toContain(
      "Boolean state with setTrue, setFalse, and toggle handlers",
    );
  });
});
