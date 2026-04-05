import test from "node:test";
import assert from "node:assert/strict";
import {
  applyChange,
  createHistory,
  redo,
  undo,
} from "./history.ts";
import type { BuilderNode } from "./types.ts";

const initialTree: BuilderNode = {
  id: "root",
  type: "Container",
  props: {},
  children: [],
};

const nextTree: BuilderNode = {
  ...initialTree,
  children: [
    {
      id: "text-1",
      type: "Text",
      props: { text: "Hello" },
      children: [],
    },
  ],
};

test("applyChange is a no-op for identical tree references", () => {
  const history = createHistory(initialTree);

  const result = applyChange(history, initialTree);

  assert.strictEqual(result, history);
});

test("undo and redo move across history transitions", () => {
  const history = createHistory(initialTree);
  const changed = applyChange(history, nextTree);
  const undone = undo(changed);
  const redone = redo(undone);

  assert.strictEqual(undone.present, initialTree);
  assert.strictEqual(undone.future[0], nextTree);
  assert.strictEqual(redone.present, nextTree);
  assert.strictEqual(redone.past[0], initialTree);
});
