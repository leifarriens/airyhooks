#!/usr/bin/env node
import { Command } from "commander";

import packageJson from "../package.json" with { type: "json" };
import { add } from "./commands/add.js";
import { entry } from "./commands/entry.js";
import { init } from "./commands/init.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("airyhooks")
  .description("Add React hooks to your project")
  .action(entry)
  .alias("search")
  .version(packageJson.version, "-v, --version");

program
  .command("init")
  .description("Initialize airyhooks configuration")
  .action(init);

program
  .command("add")
  .description("Add a hook to your project")
  .argument("<hook>", "Name of the hook to add (e.g., useDebounce)")
  .option("-r --raw", "Output only the raw hook template to console", false)
  .option(
    "-f --force",
    "Force overwrite if the hook file already exists",
    false,
  )
  .option(
    "-k --kebab",
    "Use kebab-case for the hook file and directory names. Overrides the default casing in config.",
    false,
  )
  .option(
    "--include-tests",
    "Include test files when adding hooks. Overrides the default setting in config.",
    false,
  )
  .action(add);

program.command("list").description("List all available hooks").action(list);

program.parse();
