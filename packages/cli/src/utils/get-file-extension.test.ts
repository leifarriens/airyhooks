import { describe, expect, it } from "vitest";

import { getFileExtension } from "./get-file-extension.js";

describe("getFileExtension", () => {
  it("should return correct file extension", () => {
    expect(getFileExtension("none")).toBe("");
    expect(getFileExtension("ts")).toBe(".ts");
    expect(getFileExtension("js")).toBe(".js");
    expect(getFileExtension("tsx")).toBe(".tsx");
    expect(getFileExtension("jsx")).toBe(".jsx");
  });
});
