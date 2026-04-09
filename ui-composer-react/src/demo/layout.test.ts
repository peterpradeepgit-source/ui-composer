import assert from "node:assert/strict";
import test from "node:test";
import { layoutDemo } from "./layout.ts";

test("layoutDemo starts with an empty root canvas sized for the builder stage", () => {
  assert.equal(layoutDemo.id, "root");
  assert.equal(layoutDemo.type, "Container");
  assert.deepEqual(layoutDemo.children, []);
  assert.equal(layoutDemo.props.width, "100%");
  assert.equal(layoutDemo.props.height, "85vh");
  assert.equal(layoutDemo.props.minHeight, "85vh");
});
