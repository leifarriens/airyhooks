import fs from "fs-extra";
import path from "node:path";

export interface airyhooksConfig {
  hooksPath: string;
}

export const DEFAULT_CONFIG: airyhooksConfig = {
  hooksPath: "src/hooks",
};

export async function getConfig(): Promise<airyhooksConfig> {
  const configPath = path.join(process.cwd(), "airyhooks.json");

  if (await fs.pathExists(configPath)) {
    const userConfig = (await fs.readJson(
      configPath,
    )) as Partial<airyhooksConfig>;
    return { ...DEFAULT_CONFIG, ...userConfig };
  }

  return DEFAULT_CONFIG;
}
