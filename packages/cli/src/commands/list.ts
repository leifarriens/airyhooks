import pc from "picocolors";

import { registry } from "../utils/registry.js";

export function list() {
  console.log(pc.bold("\nAvailable hooks:\n"));

  for (const hook of registry) {
    console.log(`  ${pc.cyan(hook.name)}`);
    console.log(pc.dim(`    ${hook.description}\n`));
  }

  console.log(pc.dim("Usage: airhooks add <hook-name>\n"));
}
