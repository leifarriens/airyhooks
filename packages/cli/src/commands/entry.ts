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
    initial: "use",
    message: "Select a hook to add:",
    name: "hookName",
    // eslint-disable-next-line @typescript-eslint/require-await
    async suggest(input: string, choices) {
      return choices.filter((choice) =>
        choice.title.toLowerCase().includes(input.toLowerCase()),
      );
    },
    type: "autocomplete",
  });

  const hookName = response.hookName as string;

  await add(hookName);
}
