import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import { getConfig } from "../utils/config.js";
import { getHookTemplate } from "../utils/get-hook-template.js";
import { registry } from "../utils/registry.js";

export async function add(hookName: string) {
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
  const hookDir = path.join(hooksDir, hook.name);

  // Ensure hook subdirectory exists
  await fs.ensureDir(hookDir);

  // Check if hook already exists
  const hookFilePath = path.join(hookDir, `${hook.name}.ts`);
  if (await fs.pathExists(hookFilePath)) {
    console.log(pc.yellow(`⚠ ${hook.name} already exists. Skipping.`));
    return;
  }

  // Write hook implementation
  const template = getHookTemplate(hook.name);
  await fs.writeFile(hookFilePath, template);

  // Write barrel export
  const barrelFilePath = path.join(hookDir, "index.ts");
  const barrelContent = `export { ${hook.name} } from "./${hook.name}.js";\n`;
  await fs.writeFile(barrelFilePath, barrelContent);

  console.log(pc.green(`✓ Added ${hook.name}`));
  console.log(pc.dim(`  → ${path.relative(process.cwd(), hookDir)}/`));
  console.log(pc.dim(`    ├── ${hook.name}.ts`));
  console.log(pc.dim(`    └── index.ts`));

  if (hook.dependencies && hook.dependencies.length > 0) {
    console.log(pc.dim(`\n  Required dependencies:`));
    hook.dependencies.forEach((dep) => {
      console.log(pc.dim(`    npm install ${dep}`));
    });
  }
}
