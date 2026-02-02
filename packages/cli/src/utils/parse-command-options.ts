import pc from "picocolors";
import * as v from "valibot";

export function parseCommandOptions<T>(
  schema: v.GenericSchema<unknown, T>,
  opts: unknown,
): T {
  const result = v.safeParse(schema, opts);

  if (!result.success) {
    console.log(pc.red("✗ Invalid options:"));
    result.issues.forEach((issue) => {
      const path = v.getDotPath(issue) ?? "";
      console.log(pc.red(`- ${path}: ${issue.message}`));
    });
    process.exit(1);
  }

  return result.output;
}
