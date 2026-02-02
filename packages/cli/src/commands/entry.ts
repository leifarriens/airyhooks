import pc from "picocolors";
import prompts from "prompts";

import { getConfigPath } from "../utils/config.js";
import { parseCommandOptions } from "../utils/parse-command-options.js";
import { registry } from "../utils/registry.js";
import { add, type AddOptions, AddOptionsSchema } from "./add.js";

export async function entry(commandOptions: AddOptions = {}) {
  const options = parseCommandOptions(AddOptionsSchema, commandOptions);

  const response = await prompts({
    choices: registry.map((hook) => ({
      description: hook.description,
      title: hook.name,
      value: hook.name,
    })),
    limit: 10,
    message: "Select a hook to add:",
    name: "hookName",
    async suggest(input: string, choices) {
      return Promise.resolve(
        choices
          .filter((choice) =>
            choice.title.toLowerCase().includes(input.toLowerCase()),
          )
          .sort((a, b) => a.title.localeCompare(b.title)),
      );
    },
    type: "autocomplete",
  });

  const hookName = response.hookName as string | undefined;

  if (!hookName) {
    return;
  }

  if (!getConfigPath()) {
    console.log(
      pc.yellow(
        "No airyhooks.json configuration file found. Using default configuration.",
      ),
    );
    console.log(
      pc.dim(
        "It is recommended to create a configuration file. Run `airyhooks init`.",
      ),
    );
    console.log("");
  }

  await add(hookName, options);
}
