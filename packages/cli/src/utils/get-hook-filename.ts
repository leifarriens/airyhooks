export function getHookFileBaseName(
  hookName: string,
  casing: "camelCase" | "kebab-case",
): string {
  if (casing === "camelCase") {
    return hookName;
  } else {
    return hookName
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
      .toLowerCase();
  }
}
