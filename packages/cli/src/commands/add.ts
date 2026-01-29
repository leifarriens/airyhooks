import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import { getConfig } from "../utils/config.js";
import { registry } from "../utils/registry.js";
import { HooksFetcher } from "../utils/remote-fetch.js";

interface AddOptions {
  raw?: boolean;
}

export async function add(hookName: string, options: AddOptions = {}) {
  const { raw } = options;

  const hook = registry.find(
    (h) => h.name.toLowerCase() === hookName.toLowerCase(),
  );

  if (!hook) {
    console.log(pc.red(`✗ Hook "${hookName}" not found.`));
    console.log(pc.dim("Run `airyhooks list` to see available hooks."));
    process.exit(1);
  }

  const config = await getConfig();
  const hooksDir = path.join(process.cwd(), config.hooksPath);
  const hookTargetDir = path.join(hooksDir, hook.name);

  const fetcher = new HooksFetcher();
  const template = await fetcher.fetchHook(hookName);
  const barrelContent = `export { ${hook.name} } from "./${hook.name}.js";\n`;

  if (!raw) {
    // Ensure hook subdirectory exists
    await fs.ensureDir(hookTargetDir);

    // Check if hook already exists
    const hookFilePath = path.join(hookTargetDir, `${hook.name}.ts`);
    if (await fs.pathExists(hookFilePath)) {
      console.log(pc.yellow(`⚠ ${hook.name} already exists. Skipping.`));
      return;
    }

    const barrelFilePath = path.join(hookTargetDir, "index.ts");

    // Write hook implementation
    await fs.writeFile(hookFilePath, template);

    // Write barrel export
    await fs.writeFile(barrelFilePath, barrelContent);

    console.log(pc.green(`✓ Added ${hook.name}`));
    console.log(pc.dim(`  → ${path.relative(process.cwd(), hookTargetDir)}/`));
    console.log(pc.dim(`    ├── ${hook.name}.ts`));
    console.log(pc.dim(`    └── index.ts`));
  } else {
    console.log(pc.cyan(template));
  }

  if (hook.dependencies && hook.dependencies.length > 0) {
    console.log(pc.dim(`\n  Required dependencies:`));
    hook.dependencies.forEach((dep) => {
      console.log(pc.dim(`    npm install ${dep}`));
    });
  }
}
