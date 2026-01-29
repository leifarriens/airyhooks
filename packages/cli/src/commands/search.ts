import pc from "picocolors";

import { registry } from "../utils/registry.js";

export function search(query: string) {
  const normalizedQuery = query.toLowerCase().trim();

  const filtered = registry.filter(
    (hook) =>
      hook.name.toLowerCase().includes(normalizedQuery) ||
      hook.description.toLowerCase().includes(normalizedQuery),
  );

  if (filtered.length === 0) {
    console.log(pc.yellow(`No hooks found matching "${query}"`));
    console.log(pc.dim("\nUsage: airyhooks add <hook-name>\n"));
    return;
  }

  for (const hook of filtered) {
    console.log(`  ${pc.cyan(hook.name)}`);
    console.log(pc.dim(`    ${hook.description}\n`));
  }

  console.log(pc.dim("Usage: airyhooks add <hook-name>\n"));
}
