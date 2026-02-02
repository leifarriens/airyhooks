import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import * as v from "valibot";

const configSchema = v.object({
  casing: v.optional(v.picklist(["camelCase", "kebab-case"]), "camelCase"),
  hooksPath: v.optional(v.string(), "src/hooks"),
  importExtension: v.optional(v.picklist(["js", "none", "ts"]), "none"),
  includeTests: v.optional(v.boolean(), false),
  structure: v.optional(v.picklist(["flat", "nested"]), "nested"),
});

export type AiryhooksConfig = v.InferOutput<typeof configSchema>;

export const DEFAULT_CONFIG: Readonly<AiryhooksConfig> = {
  casing: "camelCase",
  hooksPath: "src/hooks",
  importExtension: "none",
  includeTests: false,
  structure: "nested",
};

export async function getConfig(
  overrides?: Partial<AiryhooksConfig>,
): Promise<AiryhooksConfig> {
  const configPath = getConfigPath();

  if (configPath) {
    const userConfig = (await fs.readJson(
      configPath,
    )) as Partial<AiryhooksConfig>;

    const parsedUserConfig = v.safeParse(v.optional(configSchema), userConfig);

    if (!parsedUserConfig.success) {
      console.log(pc.red("✗ Invalid airyhooks.json configuration:"));
      parsedUserConfig.issues.forEach((issue) => {
        const path = v.getDotPath(issue) ?? "";
        console.log(pc.red(`- ${path}: ${issue.message}`));
      });
      process.exit(1);
    }

    return { ...DEFAULT_CONFIG, ...userConfig, ...overrides };
  }

  return { ...DEFAULT_CONFIG, ...overrides };
}

/**
 * Returns the path to the airyhooks.json configuration file if it exists,
 * otherwise returns null.
 */
export function getConfigPath(): null | string {
  const configPath = path.join(process.cwd(), "airyhooks.json");

  if (!fs.existsSync(configPath)) {
    return null;
  }

  return configPath;
}
