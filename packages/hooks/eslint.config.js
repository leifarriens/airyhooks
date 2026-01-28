import baseConfig from "@airyhooks/eslint-config";

export default [
  ...baseConfig,
  {
    ignores: ["scripts/**"],
  },
];
