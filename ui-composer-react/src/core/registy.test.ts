import assert from "node:assert/strict";
import test from "node:test";
import {
  getComponentConfig,
  getComponentMeta,
  getRegisteredComponents,
  readRuntimeRegistrationConfigs,
  registerComponent,
  registerExternalComponents,
  resetComponentRegistry,
  saveRuntimeRegistrationConfig,
} from "./registy.ts";

function createStorage() {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  } satisfies Storage;
}

test.beforeEach(() => {
  resetComponentRegistry();
});

test.afterEach(() => {
  resetComponentRegistry();
  Object.defineProperty(globalThis, "window", {
    value: undefined,
    writable: true,
    configurable: true,
  });
});

test("registerComponent stores config and metadata in the registry", () => {
  function TestComponent() {
    return null;
  }

  registerComponent("TestComponent", {
    type: "TestComponent",
    label: "Test Component",
    component: TestComponent,
    importPath: "@/components/TestComponent",
    defaultProps: { text: "hello" },
    properties: [{ name: "text", label: "Text", type: "text" }],
    canHaveChildren: false,
    source: "external",
  });

  const config = getComponentConfig("TestComponent");
  const meta = getComponentMeta("TestComponent");

  assert.equal(config?.component, TestComponent);
  assert.equal(config?.importPath, "@/components/TestComponent");
  assert.equal(meta?.label, "Test Component");
  assert.deepEqual(meta?.defaultProps, { text: "hello" });
});

test("getRegisteredComponents returns a stable snapshot until the registry changes", () => {
  const initialSnapshot = getRegisteredComponents();
  const repeatedSnapshot = getRegisteredComponents();

  assert.strictEqual(initialSnapshot, repeatedSnapshot);

  registerComponent("StableComponent", {
    type: "StableComponent",
    label: "Stable Component",
    component: () => null,
    importPath: "@/components/StableComponent",
    canHaveChildren: false,
  });

  const updatedSnapshot = getRegisteredComponents();

  assert.notStrictEqual(initialSnapshot, updatedSnapshot);
  assert.equal(updatedSnapshot.length, 1);
  assert.equal(updatedSnapshot[0]?.type, "StableComponent");
});

test("registerExternalComponents normalizes default export names from module paths", async () => {
  const result = await registerExternalComponents({
    modulePath: "./testComponentModule.ts",
    importPath: "@/core/testComponentModule",
    exportNames: ["default"],
    namespace: "fixtures",
    defaultProps: { title: "Preview" },
  });

  assert.deepEqual(result.registered, ["fixtures/testComponentModule"]);
  assert.equal(result.entries[0]?.label, "testComponentModule");
  assert.equal(getComponentMeta("fixtures/testComponentModule")?.label, "testComponentModule");
});

test("registerExternalComponents skips non-component exports and infers property schemas", async () => {
  const result = await registerExternalComponents({
    modulePath: "./testComponentModule.ts",
    exportNames: ["NamedFixtureComponent", "nonComponentValue"],
    defaultProps: {
      title: "Preview",
      count: 2,
      enabled: true,
      options: { dense: true },
    },
  });

  assert.deepEqual(result.registered, ["NamedFixtureComponent"]);
  assert.deepEqual(result.skipped, ["nonComponentValue"]);
  assert.deepEqual(getComponentMeta("NamedFixtureComponent")?.properties, [
    { name: "title", label: "title", type: "text" },
    { name: "count", label: "count", type: "number" },
    { name: "enabled", label: "enabled", type: "boolean" },
    { name: "options", label: "options", type: "json" },
  ]);
});

test("runtime registration configs persist to local storage and replace duplicates", () => {
  const localStorage = createStorage();
  Object.defineProperty(globalThis, "window", {
    value: { localStorage },
    writable: true,
    configurable: true,
  });

  saveRuntimeRegistrationConfig({
    modulePath: "@mui/material",
    importPath: "@mui/material",
    exportNames: ["Select"],
    namespace: "mui",
    canHaveChildren: false,
    defaultProps: { value: "" },
  });

  saveRuntimeRegistrationConfig({
    modulePath: "@mui/material",
    importPath: "@mui/material",
    exportNames: ["Select"],
    namespace: "mui",
    canHaveChildren: true,
    defaultProps: { value: "updated" },
  });

  const configs = readRuntimeRegistrationConfigs();

  assert.equal(configs.length, 1);
  assert.equal(configs[0]?.canHaveChildren, true);
  assert.deepEqual(configs[0]?.defaultProps, { value: "updated" });
});
