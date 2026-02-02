import type { MockInstance } from "vitest";

import fs from "fs-extra";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_CONFIG, getConfig, getConfigPath } from "./config.js";

vi.mock("fs-extra");

describe("config", () => {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("DEFAULT_CONFIG", () => {
    it("should have default hooksPath", () => {
      expect(DEFAULT_CONFIG.hooksPath).toBe("src/hooks");
    });

    it("should have default casing", () => {
      expect(DEFAULT_CONFIG.casing).toBe("camelCase");
    });

    it("should have default importExtension", () => {
      expect(DEFAULT_CONFIG.importExtension).toBe("none");
    });

    it("should have default structure", () => {
      expect(DEFAULT_CONFIG.structure).toBe("nested");
    });
  });

  describe("getConfig", () => {
    it("should return default config when no config file exists", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const config = await getConfig();

      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("should merge user config with defaults", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readJson).mockResolvedValue({ hooksPath: "lib/hooks" });

      const config = await getConfig();

      expect(config.hooksPath).toBe("lib/hooks");
    });

    it("should merge user config with defaults and overrides", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readJson).mockResolvedValue({
        casing: "camelCase",
        hooksPath: "lib/hooks",
      });

      const config = await getConfig({ casing: "kebab-case" });

      expect(config.casing).toBe("kebab-case");
    });

    it("should use defaults for missing user config properties", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readJson).mockResolvedValue({});

      const config = await getConfig();

      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("should merge structure from user config", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readJson).mockResolvedValue({ structure: "flat" });

      const config = await getConfig();

      expect(config.structure).toBe("flat");
    });

    it("should exit with error when config has invalid casing value", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readJson).mockResolvedValue({ casing: "invalid-casing" });

      await expect(getConfig()).rejects.toThrow("process.exit(1)");

      const allCalls = consoleSpy.mock.calls
        .map((call) => String(call[0]))
        .join("\n");
      expect(allCalls).toContain("Invalid airyhooks.json configuration");
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it("should exit with error when config has invalid structure value", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readJson).mockResolvedValue({ structure: "invalid" });

      await expect(getConfig()).rejects.toThrow("process.exit(1)");

      const allCalls = consoleSpy.mock.calls
        .map((call) => String(call[0]))
        .join("\n");
      expect(allCalls).toContain("Invalid airyhooks.json configuration");
    });

    it("should handle root-level validation errors", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      // Pass a non-object to trigger a root-level validation error
      vi.mocked(fs.readJson).mockResolvedValue("not-an-object");

      await expect(getConfig()).rejects.toThrow("process.exit(1)");

      const allCalls = consoleSpy.mock.calls
        .map((call) => String(call[0]))
        .join("\n");
      expect(allCalls).toContain("Invalid airyhooks.json configuration");
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("getConfigPath", () => {
    it("should return config path when file exists", () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);

      const result = getConfigPath();

      expect(result).toBe(path.join(mockCwd, "airyhooks.json"));
    });

    it("should return null when config file does not exist", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = getConfigPath();

      expect(result).toBeNull();
    });

    it("should check correct config path", () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      getConfigPath();

      expect(fs.existsSync).toHaveBeenCalledWith(
        path.join(mockCwd, "airyhooks.json"),
      );
    });
  });
});
