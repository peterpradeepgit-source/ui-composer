import test from "node:test";
import assert from "node:assert/strict";
import {
  insertAfter,
  insertBefore,
  insertNode,
  moveNode,
  replaceNodePropsRecursive,
  removeNode,
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

test("moveNode supports left and right aliases for sibling placement", () => {
  const tree = createTree();

  const movedLeft = moveNode(tree, "b", "a", "left");
  const movedRight = moveNode(tree, "a", "b", "right");

  assert.deepEqual(movedLeft.children.map((child) => child.id), ["b", "a"]);
  assert.deepEqual(movedRight.children.map((child) => child.id), ["b", "a"]);
});

test("insertNode appends a child immutably", () => {
  const tree = createTree();
  const next = insertNode(tree, "a", {
    id: "a-2",
    type: "Text",
    props: { text: "second" },
    children: [],
  });

  assert.equal(next.children[0].children.length, 2);
  assert.equal(tree.children[0].children.length, 1);
});

test("insertBefore and insertAfter place siblings around the target", () => {
  const tree = createTree();

  const before = insertBefore(tree, "b", {
    id: "before-b",
    type: "Text",
    props: { text: "before" },
    children: [],
  });
  const after = insertAfter(tree, "a", {
    id: "after-a",
    type: "Text",
    props: { text: "after" },
    children: [],
  });

  assert.deepEqual(before.children.map((child) => child.id), ["a", "before-b", "b"]);
  assert.deepEqual(after.children.map((child) => child.id), ["a", "after-a", "b"]);
});

test("removeNode returns the removed node and updated tree", () => {
  const tree = createTree();
  const result = removeNode(tree, "a");

  assert.equal(result.removedNode?.id, "a");
  assert.deepEqual(result.tree.children.map((child) => child.id), ["b"]);
  assert.deepEqual(tree.children.map((child) => child.id), ["a", "b"]);
});

test("updateNodeRecursive preserves identity when the target does not exist", () => {
  const tree = createTree();

  const result = updateNodeRecursive(tree, "missing", { text: "updated" });

  assert.strictEqual(result, tree);
});

test("updateNodeRecursive updates only the targeted node", () => {
  const tree = createTree();

  const result = updateNodeRecursive(tree, "a-1", { text: "updated" });

  assert.equal(result.children[0].children[0].props.text, "updated");
  assert.equal(tree.children[0].children[0].props.text, "child");
  assert.strictEqual(result.children[1], tree.children[1]);
});

test("replaceNodePropsRecursive replaces the entire prop object for a node", () => {
  const tree = createTree();

  const result = replaceNodePropsRecursive(tree, "a-1", { text: "replaced" });

  assert.deepEqual(result.children[0].children[0].props, { text: "replaced" });
  assert.deepEqual(tree.children[0].children[0].props, { text: "child" });
});
