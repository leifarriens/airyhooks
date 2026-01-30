import prompts from "prompts";

import { registry } from "../utils/registry.js";
import { add } from "./add.js";

export async function entry() {
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

  await add(hookName);
}
