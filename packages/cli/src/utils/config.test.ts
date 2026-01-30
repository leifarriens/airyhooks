import fs from "fs-extra";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_CONFIG, getConfig } from "./config.js";

vi.mock("fs-extra");

describe("config", () => {
  const mockCwd = "/test/project";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, "cwd").mockReturnValue(mockCwd);
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
  });

  describe("getConfig", () => {
    it("should return default config when no config file exists", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(false as never);

      const config = await getConfig();

      expect(config).toEqual(DEFAULT_CONFIG);
      expect(fs.pathExists).toHaveBeenCalledWith(
        path.join(mockCwd, "airyhooks.json"),
      );
    });

    it("should merge user config with defaults", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(true as never);
      vi.mocked(fs.readJson).mockResolvedValue({ hooksPath: "lib/hooks" });

      const config = await getConfig();

      expect(config.hooksPath).toBe("lib/hooks");
    });

    it("should merge user config with defaults and overrides", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(true as never);
      vi.mocked(fs.readJson).mockResolvedValue({
        casing: "camelCase",
        hooksPath: "lib/hooks",
      });

      const config = await getConfig({ casing: "kebab-case" });

      expect(config.casing).toBe("kebab-case");
    });

    it("should use defaults for missing user config properties", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(true as never);
      vi.mocked(fs.readJson).mockResolvedValue({});

      const config = await getConfig();

      expect(config).toEqual(DEFAULT_CONFIG);
    });

    it("should read from correct config path", async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(false as never);

      await getConfig();

      expect(fs.pathExists).toHaveBeenCalledWith(
        path.join(mockCwd, "airyhooks.json"),
      );
    });
  });
});
