import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import { type AiryhooksConfig, getConfig } from "../utils/config.js";
import { getFileExtension } from "../utils/get-file-extension.js";
import { getHookFileBaseName } from "../utils/get-hook-filename.js";
import {
  getHookTemplate,
  getHookTestTemplate,
} from "../utils/get-hook-template.js";
import { registry } from "../utils/registry.js";

interface AddOptions {
  force?: boolean;
  includeTests?: boolean;
  kebab?: boolean;
  raw?: boolean;
}

interface LogOutputOptions extends AiryhooksConfig {
  casedHookName: string;
  hookFunctionName: string;
  hookTargetDir: string;
}

export async function add(hookName: string, options: AddOptions = {}) {
  const { force, kebab, raw } = options;

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
    ...(options.includeTests ? { includeTests: true } : {}),
  });

  const hooksDir = path.join(process.cwd(), config.hooksPath);
  const casedHookName = getHookFileBaseName(hook.name, config.casing);
  const hookTargetDir = path.join(
    hooksDir,
    config.structure === "nested" ? casedHookName : "",
  );

  const template = getHookTemplate(hook.name);
  const testTemplate = getHookTestTemplate(hook.name);

  if (!raw) {
    // Ensure hook subdirectory exists
    await fs.ensureDir(hookTargetDir);

    const hookFilePath = path.join(hookTargetDir, `${casedHookName}.ts`);
    const hookTestFilePath = path.join(
      hookTargetDir,
      `${casedHookName}.test.ts`,
    );

    // Check if hook already exists
    if (!force && (await fs.pathExists(hookFilePath))) {
      console.log(pc.yellow(`⚠ ${casedHookName} already exists. Skipping.`));
      console.log(pc.dim("Use --force to overwrite existing hooks."));
      return;
    }

    const barrelFilePath = path.join(hookTargetDir, "index.ts");
    const hookImportExtension = getFileExtension(config.importExtension);

    // Write hook implementation
    await fs.writeFile(hookFilePath, template);

    // Write hook test
    if (config.includeTests) {
      const hookImplementationImportPath = `./${hookName}.js`;
      const modifiedTestTemplate = testTemplate.replace(
        hookImplementationImportPath,
        `./${hook.name}${hookImportExtension}`,
      );
      await fs.writeFile(hookTestFilePath, modifiedTestTemplate);
    }

    if (config.structure === "nested") {
      // Write barrel file for nested structure
      const barrelContent = `export { ${hook.name} } from "./${casedHookName}${hookImportExtension}";\n`;
      await fs.writeFile(barrelFilePath, barrelContent);
    }

    logOutput({
      casedHookName,
      hookFunctionName: hook.name,
      hookTargetDir,
      ...config,
    });
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

/**
 * Log output to the console after adding a hook.
 */
function logOutput({
  casedHookName,
  hookFunctionName,
  hookTargetDir,
  includeTests,
  structure,
}: LogOutputOptions) {
  const relativeHookDir = path.relative(process.cwd(), hookTargetDir);
  console.log(pc.green(`✓ Added ${hookFunctionName}`));

  if (structure === "nested") {
    console.log(pc.dim(`  → ${relativeHookDir}/`));
    if (includeTests) {
      console.log(pc.dim(`    ├── ${casedHookName}.test.ts`));
    }
    console.log(pc.dim(`    ├── ${casedHookName}.ts`));
    console.log(pc.dim(`    └── index.ts`));
  } else {
    console.log(pc.dim(`  → ${relativeHookDir}/`));
    if (includeTests) {
      console.log(pc.dim(`    ├── ${casedHookName}.test.ts`));
    }
    console.log(pc.dim(`    └── ${casedHookName}.ts`));
  }
}
