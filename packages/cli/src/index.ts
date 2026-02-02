#!/usr/bin/env node
import { Command, Option } from "commander";

import packageJson from "../package.json" with { type: "json" };
import { add } from "./commands/add.js";
import { entry } from "./commands/entry.js";
import { init } from "./commands/init.js";
import { list } from "./commands/list.js";

const options = {
  force: new Option(
    "-f, --force",
    "Force overwrite if the hook file already exists",
  ).default(false),
  includeTests: new Option(
    "--include-tests",
    "Include test files when adding hooks. Overrides the default setting in config.",
  ).default(false),
  kebab: new Option(
    "-k, --kebab",
    "Use kebab-case for the hook file and directory names. Overrides the default casing in config.",
  ).default(false),
  raw: new Option(
    "-r, --raw",
    "Output only the raw hook template to console",
  ).default(false),
} as const;

const program = new Command();

program
  .name("airyhooks")
  .description("Add React hooks to your project")
  .action(entry)
  .addOption(options.raw)
  .addOption(options.force)
  .addOption(options.includeTests)
  .addOption(options.kebab)
  .version(packageJson.version, "-v, --version");

program
  .command("init")
  .description("Initialize airyhooks configuration")
  .action(init);

program
  .command("add")
  .description("Add a hook to your project")
  .argument("<hook>", "Name of the hook to add (e.g., useDebounce)")
  .addOption(options.raw)
  .addOption(options.force)
  .addOption(options.includeTests)
  .addOption(options.kebab)
  .action(add);

program.command("list").description("List all available hooks").action(list);

program.parse();
