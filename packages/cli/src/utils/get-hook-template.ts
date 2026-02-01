import { templates } from "./hook-templates.js";

/**
 * Get the hook template from the generated template file.
 */
export function getHookTemplate(hookName: string): string {
  const template = templates[hookName];

  if (!template) {
    throw new Error(`Template for hook "${hookName}" not found`);
  }

  return template;
}

export function getHookTestTemplate(hookName: string): string {
  const template = templates[`${hookName}_test`];

  if (!template) {
    throw new Error(`Test template for hook "${hookName}" not found`);
  }

  return template;
}
