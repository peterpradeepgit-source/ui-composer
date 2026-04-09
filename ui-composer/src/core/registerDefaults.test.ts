import assert from "node:assert/strict";
import test from "node:test";
import { defaultComponentMeta } from "./componentMeta.ts";

test("default component metadata includes the latest common builder component library", () => {
  const registeredTypes = defaultComponentMeta.map((component) => component.type);

  for (const expectedType of [
    "Container",
    "Button",
    "Text",
    "Select",
    "Dropdown",
    "TextArea",
    "Radio",
    "Table",
    "DataTable",
    "Accordion",
    "Box",
    "Card",
    "Checkbox",
    "Dialog",
    "Form",
    "Input",
    "Menu",
    "List",
    "Tab",
    "Switch",
    "Toggle",
    "Toolbar",
    "Tooltip",
  ]) {
    assert.ok(registeredTypes.includes(expectedType), `${expectedType} should be registered`);
  }
});

test("default component metadata preserves important behavior flags for common components", () => {
  const componentMetaByType = Object.fromEntries(
    defaultComponentMeta.map((component) => [component.type, component]),
  );

  assert.equal(componentMetaByType.Container?.canHaveChildren, true);
  assert.equal(componentMetaByType.Dialog?.canHaveChildren, true);
  assert.equal(componentMetaByType.Input?.canHaveChildren, false);
  assert.equal(componentMetaByType.DataTable?.defaultProps?.striped, true);
});
