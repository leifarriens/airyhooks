import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import { getConfig } from "../utils/config.js";
import { getFileExtension } from "../utils/get-file-extension.js";
import { getHookFileBaseName } from "../utils/get-hook-filename.js";
import { getHookTemplate } from "../utils/get-hook-template.js";
import { registry } from "../utils/registry.js";

interface AddOptions {
  kebab?: boolean;
  raw?: boolean;
}

export async function add(hookName: string, options: AddOptions = {}) {
  const { kebab, raw } = options;

  const hook = registry.find(
    (h) => h.name.toLowerCase() === hookName.toLowerCase(),
  );

  if (!hook) {
    console.log(pc.red(`✗ Hook "${hookName}" not found.`));
    console.log(pc.dim("Run `airyhooks list` to see available hooks."));
    process.exit(1);
  }

  const config = await getConfig({
    ...(kebab ? { casing: "kebab-case" } : {}),
  });

  const hooksDir = path.join(process.cwd(), config.hooksPath);
  const casedHookName = getHookFileBaseName(hook.name, config.casing);
  const hookTargetDir = path.join(hooksDir, casedHookName);

  const template = getHookTemplate(hook.name);
  const barrelContent = `export { ${hook.name} } from "./${casedHookName}${getFileExtension(config.importExtension)}";\n`;

  if (!raw) {
    // Ensure hook subdirectory exists
    await fs.ensureDir(hookTargetDir);

    const hookFilePath = path.join(hookTargetDir, `${casedHookName}.ts`);

    // Check if hook already exists
    if (await fs.pathExists(hookFilePath)) {
      console.log(pc.yellow(`⚠ ${casedHookName} already exists. Skipping.`));
      return;
    }

    const barrelFilePath = path.join(hookTargetDir, "index.ts");

    // Write hook implementation
    await fs.writeFile(hookFilePath, template);

    // Write barrel export
    await fs.writeFile(barrelFilePath, barrelContent);

    console.log(pc.green(`✓ Added ${hook.name}`));
    console.log(pc.dim(`  → ${path.relative(process.cwd(), hookTargetDir)}/`));
    console.log(pc.dim(`    ├── ${casedHookName}.ts`));
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
