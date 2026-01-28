import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import prompts from "prompts";

import { type AirhooksConfig, DEFAULT_CONFIG } from "../utils/config.js";

export async function init() {
  const configPath = path.join(process.cwd(), "airhooks.json");

  if (await fs.pathExists(configPath)) {
    const response = await prompts({
      initial: false,
      message: "airhooks.json already exists. Overwrite?",
      name: "overwrite",
      type: "confirm",
    });

    if (!response.overwrite) {
      console.log(pc.yellow("Initialization cancelled."));
      return;
    }
  }

  const response = await prompts({
    initial: DEFAULT_CONFIG.hooksPath,
    message: "Where would you like to store your hooks?",
    name: "hooksPath",
    type: "text",
  });

  const hooksPath = response.hooksPath as string | undefined;

  if (!hooksPath) {
    console.log(pc.yellow("Initialization cancelled."));
    return;
  }

  const config: AirhooksConfig = {
    hooksPath,
  };

  await fs.writeJson(configPath, config, { spaces: 2 });

  console.log(pc.green("✓ Created airhooks.json"));
  console.log(pc.dim(`  Hooks will be added to ${hooksPath}`));
}
