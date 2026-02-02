import type { MockInstance } from "vitest";

import prompts from "prompts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HookDefinition } from "../utils/registry.js";

import * as configModule from "../utils/config.js";
import * as parseCommandOptionsModule from "../utils/parse-command-options.js";
import * as registryModule from "../utils/registry.js";
import * as addModule from "./add.js";
import { entry } from "./entry.js";

vi.mock("prompts");
vi.mock("../utils/config.js");
vi.mock("../utils/parse-command-options.js");
vi.mock("../utils/registry.js");
vi.mock("./add.js");

describe("entry", () => {
  let addSpy: MockInstance;
  let consoleSpy: MockInstance<(message?: unknown) => void>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    addSpy = vi.mocked(addModule.add).mockResolvedValue(undefined);
    vi.mocked(configModule.getConfigPath).mockReturnValue(
      "/test/airyhooks.json",
    );
    vi.mocked(parseCommandOptionsModule.parseCommandOptions).mockImplementation(
      (_schema, opts) => opts as Record<string, unknown>,
    );
    vi.mocked(registryModule).registry = [
      {
        description: "Debounce a value with a specified delay",
        name: "useDebounce",
      },
      {
        description: "Track window size",
        name: "useWindowSize",
      },
    ] as HookDefinition[];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should display autocomplete prompt with registry hooks", async () => {
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry();

    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        choices: [
          {
            description: "Debounce a value with a specified delay",
            title: "useDebounce",
            value: "useDebounce",
          },
          {
            description: "Track window size",
            title: "useWindowSize",
            value: "useWindowSize",
          },
        ],
        limit: 10,
        message: "Select a hook to add:",
        name: "hookName",
        type: "autocomplete",
      }),
    );
  });

  it("should call add with selected hook name and options", async () => {
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry();

    expect(addSpy).toHaveBeenCalledWith("useDebounce", {});
  });

  it("should not call add when user cancels selection", async () => {
    vi.mocked(prompts).mockResolvedValue({ hookName: undefined });

    await entry();

    expect(addSpy).not.toHaveBeenCalled();
  });

  it("should not call add when response is empty", async () => {
    vi.mocked(prompts).mockResolvedValue({});

    await entry();

    expect(addSpy).not.toHaveBeenCalled();
  });

  it("should have suggest function that filters choices case-insensitively", async () => {
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry();

    const promptCall = vi.mocked(prompts).mock.calls[0]?.[0] as {
      suggest: (
        input: string,
        choices: { title: string }[],
      ) => Promise<{ title: string }[]>;
    };

    const choices = [
      { title: "useDebounce" },
      { title: "useWindowSize" },
      { title: "useMount" },
    ];

    const result = await promptCall.suggest("window", choices);

    expect(result).toEqual([{ title: "useWindowSize" }]);
  });

  it("should sort filtered choices alphabetically", async () => {
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry();

    const promptCall = vi.mocked(prompts).mock.calls[0]?.[0] as {
      suggest: (
        input: string,
        choices: { title: string }[],
      ) => Promise<{ title: string }[]>;
    };

    const choices = [
      { title: "useZoom" },
      { title: "useAlpha" },
      { title: "useBeta" },
    ];

    const result = await promptCall.suggest("use", choices);

    expect(result).toEqual([
      { title: "useAlpha" },
      { title: "useBeta" },
      { title: "useZoom" },
    ]);
  });

  it("should show warning when no config file exists", async () => {
    vi.mocked(configModule.getConfigPath).mockReturnValue(null);
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry();

    const allCalls = consoleSpy.mock.calls
      .map((call) => String(call[0]))
      .join("\n");
    expect(allCalls).toContain("No airyhooks.json configuration file found");
    expect(allCalls).toContain("airyhooks init");
  });

  it("should not show warning when config file exists", async () => {
    vi.mocked(configModule.getConfigPath).mockReturnValue(
      "/test/airyhooks.json",
    );
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry();

    const allCalls = consoleSpy.mock.calls
      .map((call) => String(call[0]))
      .join("\n");
    expect(allCalls).not.toContain(
      "No airyhooks.json configuration file found",
    );
  });

  it("should pass options through to add command", async () => {
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry({ force: true, kebab: true });

    expect(addSpy).toHaveBeenCalledWith("useDebounce", {
      force: true,
      kebab: true,
    });
  });
});
