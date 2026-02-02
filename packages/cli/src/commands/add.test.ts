import type { MockInstance } from "vitest";

import fs from "fs-extra";
import path from "node:path";
import prompts from "prompts";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HookDefinition } from "../utils/registry.js";

import * as config from "../utils/config.js";
import * as hookTemplate from "../utils/get-hook-template.js";
import * as registryModule from "../utils/registry.js";
import { add } from "./add.js";

vi.mock("fs-extra");
vi.mock("prompts");
vi.mock("../utils/config.js");
vi.mock("../utils/get-hook-template.js");
vi.mock("../utils/registry.js");

function getConsoleOutput(
  spy: MockInstance<(message?: unknown) => void>,
): string {
  return spy.mock.calls.map((call) => String(call[0])).join("\n");
}

describe("add", () => {
  const mockCwd = "/test/project";
  let consoleSpy: MockInstance<(message?: unknown) => void>;
  let exitSpy: MockInstance<(code?: number) => never>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, "cwd").mockReturnValue(mockCwd);
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((code?: null | number | string) => {
        throw new Error(`process.exit(${String(code)})`);
      });

    vi.mocked(config.getConfig).mockResolvedValue(config.DEFAULT_CONFIG);
    vi.mocked(hookTemplate.getHookTemplate).mockReturnValue(
      "// mock template content",
    );
    vi.mocked(registryModule).registry = [
      {
        description: "Debounce a value with a specified delay",
        name: "useDebounce",
      },
      {
        dependencies: ["lodash"],
        description: "A hook with dependencies",
        name: "useWithDeps",
      },
    ] as HookDefinition[];
    vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
    vi.mocked(fs.pathExists).mockResolvedValue(false as never);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(prompts).mockResolvedValue({ overwrite: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fail for non-existent hook", async () => {
    await expect(add("useNonExistent")).rejects.toThrow("process.exit(1)");

    expect(consoleSpy).toHaveBeenCalled();
    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("not found");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it("should find hook case-insensitively", async () => {
    await add("USEDEBOUNCE");

    expect(exitSpy).not.toHaveBeenCalled();
    expect(fs.ensureDir).toHaveBeenCalled();
  });

  it("should create hook directory", async () => {
    await add("useDebounce");

    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(mockCwd, "src/hooks", "useDebounce"),
    );
  });

  it("should prompt for overwrite when hook already exists", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    vi.mocked(prompts).mockResolvedValue({ overwrite: false });

    await add("useDebounce");

    expect(prompts).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Overwrite existing hook?",
        name: "overwrite",
        type: "confirm",
      }),
    );
    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("already exists");
    expect(allCalls).toContain('Use "--force" to overwrite existing hooks.');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it("should overwrite when user confirms via prompt", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    vi.mocked(prompts).mockResolvedValue({ overwrite: true });

    await add("useDebounce");

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockCwd, "src/hooks/useDebounce", "useDebounce.ts"),
      "// mock template content",
    );
  });

  it("should write hook file", async () => {
    await add("useDebounce");

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockCwd, "src/hooks/useDebounce", "useDebounce.ts"),
      "// mock template content",
    );
  });

  it("should write barrel export file", async () => {
    await add("useDebounce");

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockCwd, "src/hooks/useDebounce", "index.ts"),
      'export { useDebounce } from "./useDebounce";\n',
    );
  });

  it("should write barrel export file with given importExtension", async () => {
    vi.mocked(config.getConfig).mockResolvedValue({
      ...config.DEFAULT_CONFIG,
      importExtension: "js",
    });

    await add("useDebounce");

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockCwd, "src/hooks/useDebounce", "index.ts"),
      'export { useDebounce } from "./useDebounce.js";\n',
    );
  });

  it("should log success message", async () => {
    await add("useDebounce");

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("Added useDebounce");
  });

  it("should use custom hooks path from config", async () => {
    vi.mocked(config.getConfig).mockResolvedValue({
      ...config.DEFAULT_CONFIG,
      hooksPath: "lib/hooks",
    });

    await add("useDebounce");

    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(mockCwd, "lib/hooks", "useDebounce"),
    );
  });

  it("should write file in kebab-case when casing is kebab-case", async () => {
    vi.mocked(config.getConfig).mockResolvedValue({
      ...config.DEFAULT_CONFIG,
      casing: "kebab-case",
      hooksPath: "lib/hooks",
    });

    await add("useDebounce");

    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(mockCwd, "lib/hooks", "use-debounce"),
    );
  });

  it("should write file in kebab-case when kebab option is true", async () => {
    vi.mocked(config.getConfig).mockResolvedValue({
      ...config.DEFAULT_CONFIG,
      casing: "kebab-case",
      hooksPath: "lib/hooks",
    });

    await add("useDebounce", { kebab: true });

    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(mockCwd, "lib/hooks", "use-debounce"),
    );
  });

  it("should suggest list command for unknown hooks", async () => {
    await expect(add("unknownHook")).rejects.toThrow("process.exit(1)");

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("airyhooks list");
  });

  it("should output template to console when raw flag is true", async () => {
    await add("useDebounce", { raw: true });

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("// mock template content");
  });

  it("should output debug information when debug option is true", async () => {
    const debugSpy = vi
      .spyOn(console, "debug")
      .mockImplementation(() => undefined);

    await add("useDebounce", { debug: true });

    expect(debugSpy).toHaveBeenCalledWith("Parsed command options:");
    expect(debugSpy).toHaveBeenCalledWith(
      expect.objectContaining({ debug: true }),
    );
    expect(debugSpy).toHaveBeenCalledWith("Resolved configuration:");
    expect(debugSpy).toHaveBeenCalledWith(config.DEFAULT_CONFIG);
  });

  it("should pass path override from CLI option to getConfig", async () => {
    await add("useDebounce", { path: "lib/custom" });

    expect(config.getConfig).toHaveBeenCalledWith(
      expect.objectContaining({ hooksPath: "lib/custom" }),
    );
  });

  it("should not create directory when raw flag is true", async () => {
    await add("useDebounce", { raw: true });

    expect(fs.ensureDir).not.toHaveBeenCalled();
  });

  it("should not write files when raw flag is true", async () => {
    await add("useDebounce", { raw: true });

    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it("should still fail for non-existent hook with raw flag", async () => {
    await expect(add("useNonExistent", { raw: true })).rejects.toThrow(
      "process.exit(1)",
    );

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("not found");
  });

  it("should show dependencies after adding hook", async () => {
    await add("useWithDeps");

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("npm install lodash");
  });

  it("should show dependencies with raw flag", async () => {
    await add("useWithDeps", { raw: true });

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).toContain("npm install lodash");
  });

  it("should overwrite hook when force flag is true and file exists", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);

    await add("useDebounce", { force: true });

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockCwd, "src/hooks/useDebounce", "useDebounce.ts"),
      "// mock template content",
    );
  });

  it("should not show skip warning when force flag is true", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);

    await add("useDebounce", { force: true });

    const allCalls = getConsoleOutput(consoleSpy);
    expect(allCalls).not.toContain("already exists");
    expect(allCalls).toContain("Added useDebounce");
  });

  it("should write barrel file when force flag is true and file exists", async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);

    await add("useDebounce", { force: true });

    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(mockCwd, "src/hooks/useDebounce", "index.ts"),
      'export { useDebounce } from "./useDebounce";\n',
    );
  });

  describe("structure option", () => {
    it("should create hook in subdirectory with barrel file when structure is nested", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        structure: "nested",
      });

      await add("useDebounce");

      expect(fs.ensureDir).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks", "useDebounce"),
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks/useDebounce", "useDebounce.ts"),
        "// mock template content",
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks/useDebounce", "index.ts"),
        'export { useDebounce } from "./useDebounce";\n',
      );
    });

    it("should create hook directly in hooks directory when structure is flat", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        structure: "flat",
      });

      await add("useDebounce");

      expect(fs.ensureDir).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks"),
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks", "useDebounce.ts"),
        "// mock template content",
      );
    });

    it("should not create barrel file when structure is flat", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        structure: "flat",
      });

      await add("useDebounce");

      const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
      const indexFileCall = writeFileCalls.find((call) =>
        String(call[0]).endsWith("index.ts"),
      );
      expect(indexFileCall).toBeUndefined();
    });

    it("should use kebab-case with flat structure", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        casing: "kebab-case",
        structure: "flat",
      });

      await add("useDebounce");

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks", "use-debounce.ts"),
        "// mock template content",
      );
    });
  });

  describe("includeTests option", () => {
    beforeEach(() => {
      vi.mocked(hookTemplate.getHookTestTemplate).mockReturnValue(
        "// mock test template content",
      );
    });

    it("should write test file when includeTests is true in config with nested structure", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        includeTests: true,
        structure: "nested",
      });

      await add("useDebounce");

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks/useDebounce", "useDebounce.test.ts"),
        expect.any(String),
      );
    });

    it("should write test file when includeTests is true in config with flat structure", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        includeTests: true,
        structure: "flat",
      });

      await add("useDebounce");

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockCwd, "src/hooks", "useDebounce.test.ts"),
        expect.any(String),
      );
    });

    it("should log test file in output when includeTests is true with nested structure", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        includeTests: true,
        structure: "nested",
      });

      await add("useDebounce");

      const allCalls = getConsoleOutput(consoleSpy);
      expect(allCalls).toContain("useDebounce.test.ts");
    });

    it("should log test file in output when includeTests is true with flat structure", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        includeTests: true,
        structure: "flat",
      });

      await add("useDebounce");

      const allCalls = getConsoleOutput(consoleSpy);
      expect(allCalls).toContain("useDebounce.test.ts");
    });

    it("should pass includeTests override from CLI option to getConfig", async () => {
      await add("useDebounce", { includeTests: true });

      expect(config.getConfig).toHaveBeenCalledWith(
        expect.objectContaining({ includeTests: true }),
      );
    });

    it("should not write test file when includeTests is false", async () => {
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        includeTests: false,
      });

      await add("useDebounce");

      const writeFileCalls = vi.mocked(fs.writeFile).mock.calls;
      const testFileCall = writeFileCalls.find((call) =>
        String(call[0]).endsWith(".test.ts"),
      );
      expect(testFileCall).toBeUndefined();
    });

    it("should replace import extension in test template with configured importExtension", async () => {
      vi.mocked(hookTemplate.getHookTestTemplate).mockReturnValue(
        'import { useDebounce } from "./useDebounce.js";\n\ndescribe("useDebounce", () => {});',
      );
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        importExtension: "ts",
        includeTests: true,
      });

      await add("useDebounce");

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining("useDebounce.test.ts"),
        'import { useDebounce } from "./useDebounce.ts";\n\ndescribe("useDebounce", () => {});',
      );
    });

    it("should replace import extension in test template with no extension when importExtension is none", async () => {
      vi.mocked(hookTemplate.getHookTestTemplate).mockReturnValue(
        'import { useDebounce } from "./useDebounce.js";\n\ndescribe("useDebounce", () => {});',
      );
      vi.mocked(config.getConfig).mockResolvedValue({
        ...config.DEFAULT_CONFIG,
        importExtension: "none",
        includeTests: true,
      });

      await add("useDebounce");

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining("useDebounce.test.ts"),
        'import { useDebounce } from "./useDebounce";\n\ndescribe("useDebounce", () => {});',
      );
    });
  });
});
