import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { getGeneratedTemplateFileContent } from "../scripts/generate-templates.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(
  __dirname,
  "../../cli/src/utils/hook-templates.ts",
);

describe("hook templates", () => {
  it("matches the generated CLI template file", () => {
    expect(fs.readFileSync(templatePath, "utf-8")).toBe(
      getGeneratedTemplateFileContent(),
    );
  });
});
