// @ts-check

import * as path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";
import turboConfig from "eslint-config-turbo/flat";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  turboConfig,
  perfectionist.configs["recommended-natural"],
  { ignores: ["**/*.config.*"] },
  includeIgnoreFile(path.join(import.meta.dirname, "../../.gitignore")),
  {
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
