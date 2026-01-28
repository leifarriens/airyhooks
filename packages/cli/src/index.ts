#!/usr/bin/env node
import { Command } from "commander";

import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("airyhooks")
  .description("Add React hooks to your project")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize airyhooks configuration")
  .action(init);

program
  .command("add")
  .description("Add a hook to your project")
  .argument("<hook>", "Name of the hook to add (e.g., useDebounce)")
  .action(add);

program.command("list").description("List all available hooks").action(list);

program.parse();
