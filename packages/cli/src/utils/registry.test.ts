import { describe, expect, it } from "vitest";

import { type HookDefinition, registry } from "./registry.js";

describe("registry", () => {
  it("should export an array of hooks", () => {
    expect(Array.isArray(registry)).toBe(true);
    expect(registry.length).toBeGreaterThan(0);
  });

  it("should have valid hook definitions", () => {
    for (const hook of registry) {
      expect(hook).toHaveProperty("name");
      expect(hook).toHaveProperty("description");
      expect(typeof hook.name).toBe("string");
      expect(typeof hook.description).toBe("string");
      expect(hook.name.length).toBeGreaterThan(0);
      expect(hook.description.length).toBeGreaterThan(0);
    }
  });

  it("should have unique hook names", () => {
    const names = registry.map((h) => h.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("should have hook names starting with 'use'", () => {
    for (const hook of registry) {
      expect(hook.name.startsWith("use")).toBe(true);
    }
  });

  it("should include expected hooks", () => {
    const hookNames = registry.map((h) => h.name);
    expect(hookNames).toContain("useDebounce");
    expect(hookNames).toContain("useLocalStorage");
    expect(hookNames).toContain("useCounter");
  });

  it("should have valid dependencies when present", () => {
    for (const hook of registry) {
      if (hook.dependencies) {
        expect(Array.isArray(hook.dependencies)).toBe(true);
        for (const dep of hook.dependencies) {
          expect(typeof dep).toBe("string");
        }
      }
    }
  });

  it("should satisfy HookDefinition interface", () => {
    const testHook: HookDefinition = {
      description: "Test description",
      name: "useTest",
    };
    expect(testHook.name).toBe("useTest");
    expect(testHook.description).toBe("Test description");

    const hookWithDeps: HookDefinition = {
      dependencies: ["react"],
      description: "Test with deps",
      name: "useTestWithDeps",
    };
    expect(hookWithDeps.dependencies).toEqual(["react"]);
  });
});
