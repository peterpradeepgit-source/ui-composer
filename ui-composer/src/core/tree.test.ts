import test from "node:test";
import assert from "node:assert/strict";
import {
  moveNode,
  updateNodeRecursive,
} from "./tree.ts";
import type { BuilderNode } from "./types.ts";

function createTree(): BuilderNode {
  return {
    id: "root",
    type: "Container",
    props: {},
    children: [
      {
        id: "a",
        type: "Container",
        props: {},
        children: [
          {
            id: "a-1",
            type: "Text",
            props: { text: "child" },
            children: [],
          },
        ],
      },
      {
        id: "b",
        type: "Button",
        props: { children: "Button" },
        children: [],
      },
    ],
  };
}

test("moveNode returns the original tree when attempting to drag the root", () => {
  const tree = createTree();

  const result = moveNode(tree, "root", "b", "before");

  assert.strictEqual(result, tree);
});

test("moveNode returns the original tree when target is a descendant of the dragged node", () => {
  const tree = createTree();

  const result = moveNode(tree, "a", "a-1", "before");

  assert.strictEqual(result, tree);
});

test("moveNode reorders siblings immutably for valid moves", () => {
  const tree = createTree();

  const result = moveNode(tree, "b", "a", "before");

  assert.notStrictEqual(result, tree);
  assert.deepEqual(result.children.map((child) => child.id), ["b", "a"]);
  assert.deepEqual(tree.children.map((child) => child.id), ["a", "b"]);
});

test("updateNodeRecursive preserves identity when the target does not exist", () => {
  const tree = createTree();

  const result = updateNodeRecursive(tree, "missing", { text: "updated" });

  assert.strictEqual(result, tree);
});
