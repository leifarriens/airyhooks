import type { MockInstance } from "vitest";

import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { init } from "./init.js";

vi.mock("fs-extra");
vi.mock("prompts");

function getConsoleOutput(
  spy: MockInstance<(message?: unknown) => void>,
): string {
  return spy.mock.calls.map((call) => String(call[0])).join("\n");
}

const defaultPromptsResolveMock = {
  casing: "camelCase",
  hooksPath: "src/hooks",
  includeTests: false,
};

describe("init", () => {
  const mockCwd = "/test/project";
  let consoleSpy: MockInstance<(message?: unknown) => void>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, "cwd").mockReturnValue(mockCwd);
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.mocked(fs.pathExists).mockResolvedValue(false as never);
    vi.mocked(fs.writeJson).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should prompt for hooks path when no config exists", async () => {
    vi.mocked(prompts).mockResolvedValue(defaultPromptsResolveMock);

    await init();

    expect(prompts).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Where would you like to store your hooks?",
          name: "hooksPath",
          type: "text",
        }),
      ]),
    );
  });

  it("should create config file with user-specified options", async () => {
    vi.mocked(prompts).mockResolvedValue(defaultPromptsResolveMock);

    await init();

    expect(fs.writeJson).toHaveBeenCalledWith(
      path.join(mockCwd, "airyhooks.json"),
      {
        casing: "camelCase",
        hooksPath: "src/hooks",
        includeTests: false,
      },
      { spaces: 2 },
    );
  });

  it("should prompt for overwrite when config exists", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    vi.mocked(prompts)
      .mockResolvedValueOnce({ overwrite: true })
      .mockResolvedValueOnce({ hooksPath: "src/hooks" });

    await init();

    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "airyhooks.json already exists. Overwrite?",
        name: "overwrite",
        type: "confirm",
      }),
    );
  });

  it("should cancel when user declines overwrite", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    vi.mocked(prompts).mockResolvedValue({ overwrite: false });

    await init();

    expect(fs.writeJson).not.toHaveBeenCalled();
    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("cancelled");
  });

  it("should cancel when user provides no hooks path", async () => {
    vi.mocked(prompts).mockResolvedValue({
      ...defaultPromptsResolveMock,
      hooksPath: undefined,
    });

    await init();

    expect(fs.writeJson).not.toHaveBeenCalled();
    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("cancelled");
  });

  it("should log success message after creating config", async () => {
    vi.mocked(prompts).mockResolvedValue(defaultPromptsResolveMock);

    await init();

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("Created airyhooks.json");
  });

  it("should use default path as initial prompt value for hooksPath", async () => {
    vi.mocked(prompts).mockResolvedValue(defaultPromptsResolveMock);

    await init();

    expect(prompts).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          initial: "src/hooks",
        }),
      ]),
    );
  });

  it("should use camelCase as initial prompt value for casing", async () => {
    vi.mocked(prompts).mockResolvedValue(defaultPromptsResolveMock);

    await init();

    expect(prompts).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          initial: 0, // Index of 'camelCase' in choices
        }),
      ]),
    );
  });

  it("should prompt for includeTests option", async () => {
    vi.mocked(prompts).mockResolvedValue(defaultPromptsResolveMock);

    await init();

    expect(prompts).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Would you like to include test files for your hooks?",
          name: "includeTests",
          type: "toggle",
        }),
      ]),
    );
  });

  it("should cancel when user provides no casing", async () => {
    vi.mocked(prompts).mockResolvedValue({
      ...defaultPromptsResolveMock,
      casing: undefined,
    });

    await init();

    expect(fs.writeJson).not.toHaveBeenCalled();
    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("cancelled");
  });

  it("should cancel when user provides no includeTests", async () => {
    vi.mocked(prompts).mockResolvedValue({
      casing: "camelCase",
      hooksPath: "src/hooks",
      includeTests: undefined,
    });

    await init();

    expect(fs.writeJson).not.toHaveBeenCalled();
    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("cancelled");
  });
});
