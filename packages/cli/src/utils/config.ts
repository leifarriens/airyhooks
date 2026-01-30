import fs from "fs-extra";
import path from "node:path";

export interface AiryhooksConfig {
  casing: Casing;
  hooksPath: string;
  /**
   * File extension for imports.
   * Use `js` when `moduleResolution` is set to `nodenext` in tsconfig.
   *
   * Use `ts` when `allowImportingTsExtensions` is enabled.
   *
   * Use `none` when using `moduleResolution: bundler`.
   */
  importExtension: "js" | "none" | "ts";
  /**
   * Whether hooks are organized in a flat directory structure or nested.
   */
  structure: "flat" | "nested";
}

export type Casing = "camelCase" | "kebab-case";

export const DEFAULT_CONFIG: Readonly<AiryhooksConfig> = {
  casing: "camelCase",
  hooksPath: "src/hooks",
  importExtension: "none",
  structure: "nested",
};

export async function getConfig(
  overrides?: Partial<AiryhooksConfig>,
): Promise<AiryhooksConfig> {
  const configPath = path.join(process.cwd(), "airyhooks.json");

  if (await fs.pathExists(configPath)) {
    const userConfig = (await fs.readJson(
      configPath,
    )) as Partial<AiryhooksConfig>;

    return { ...DEFAULT_CONFIG, ...userConfig, ...overrides };
  }

  return { ...DEFAULT_CONFIG, ...overrides };
}
