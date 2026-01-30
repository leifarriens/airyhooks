import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import prompts from "prompts";

import {
  type AiryhooksConfig,
  type Casing,
  DEFAULT_CONFIG,
} from "../utils/config.js";

export async function init() {
  const configPath = path.join(process.cwd(), "airyhooks.json");

  if (await fs.pathExists(configPath)) {
    const response = await prompts({
      initial: false,
      message: "airyhooks.json already exists. Overwrite?",
      name: "overwrite",
      type: "confirm",
    });

    if (!response.overwrite) {
      console.log(pc.yellow("Initialization cancelled."));
      return;
    }
  }

  const response = await prompts([
    {
      initial: DEFAULT_CONFIG.hooksPath,
      message: "Where would you like to store your hooks?",
      name: "hooksPath",
      type: "text",
    },
    {
      choices: [
        {
          description: "Use camelCase for hook file and directory names",
          title: "useDebounce",
          value: "camelCase",
        },
        {
          description: "Use kebab-case for hook file and directory names",
          title: "use-debounce",
          value: "kebab-case",
        },
      ],
      initial: 0,
      message:
        "What naming convention would you like to use for your hook files and directories?",
      name: "casing",
      type: "select",
    },
  ]);

  const hooksPath = response.hooksPath as string | undefined;
  const casing = response.casing as Casing | undefined;

  if (!hooksPath || !casing) {
    console.log(pc.yellow("Initialization cancelled."));
    return;
  }

  const config: AiryhooksConfig = {
    ...DEFAULT_CONFIG,
    casing,
    hooksPath,
  };

  await fs.writeJson(configPath, config, { spaces: 2 });

  console.log(pc.green("✓ Created airyhooks.json"));
  console.log(pc.dim(`  Hooks will be added to ${hooksPath}`));
}
