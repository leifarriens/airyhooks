import type { MockInstance } from "vitest";

import prompts from "prompts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HookDefinition } from "../utils/registry.js";

import * as registryModule from "../utils/registry.js";
import * as addModule from "./add.js";
import { entry } from "./entry.js";

vi.mock("prompts");
vi.mock("../utils/registry.js");
vi.mock("./add.js");

describe("entry", () => {
  let addSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    addSpy = vi.mocked(addModule.add).mockResolvedValue(undefined);
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

  it("should call add with selected hook name", async () => {
    vi.mocked(prompts).mockResolvedValue({ hookName: "useDebounce" });

    await entry();

    expect(addSpy).toHaveBeenCalledWith("useDebounce");
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
});
