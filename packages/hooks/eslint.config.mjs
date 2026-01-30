import baseConfig from "@airyhooks/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  baseConfig,
  reactHooks.configs.flat["recommended-latest"],
  {
    ignores: ["scripts/**"],
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      // In test files, we need to capture hook results for assertions
      // This pattern is common in React testing and is safe in test contexts
      "react-hooks/globals": "off",
      "react-hooks/immutability": "off",
    },
  },
]);
