import fs from "fs-extra";
import path from "node:path";

export interface AiryhooksConfig {
  casing: Casing;
  hooksPath: string;
}

export type Casing = "camelCase" | "kebab-case";

export const DEFAULT_CONFIG: Readonly<AiryhooksConfig> = {
  casing: "camelCase",
  hooksPath: "src/hooks",
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
