import fs from "fs-extra";
import path from "node:path";

export interface AirhooksConfig {
  hooksPath: string;
}

export const DEFAULT_CONFIG: AirhooksConfig = {
  hooksPath: "src/hooks",
};

export async function getConfig(): Promise<AirhooksConfig> {
  const configPath = path.join(process.cwd(), "airhooks.json");

  if (await fs.pathExists(configPath)) {
    const userConfig = (await fs.readJson(
      configPath,
    )) as Partial<AirhooksConfig>;
    return { ...DEFAULT_CONFIG, ...userConfig };
  }

  return DEFAULT_CONFIG;
}
