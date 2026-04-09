import test from "node:test";
import assert from "node:assert/strict";
import { applyDrop, getDropPosition } from "./drop.ts";
import type { BuilderNode } from "../core/types.ts";

function createTree(): BuilderNode {
  return {
    id: "root",
    type: "Container",
    props: {},
    children: [
      {
        id: "container",
        type: "Container",
        props: {},
        children: [],
      },
      {
        id: "button",
        type: "Button",
        props: { children: "Button" },
        children: [],
      },
    ],
  };
}

test("getDropPosition returns null in the middle of non-container nodes", () => {
  assert.equal(getDropPosition(50, 50, 100, 100, false), null);
});

test("getDropPosition only allows inside drops when sibling insertion is disabled", () => {
  assert.equal(getDropPosition(5, 5, 300, 120, true, false), "inside");
});

test("getDropPosition supports left and right sibling placement", () => {
  assert.equal(getDropPosition(10, 50, 200, 100, true, true, true), "left");
  assert.equal(getDropPosition(190, 50, 200, 100, true, true, true), "right");
});

test("applyDrop is a no-op for a center drop on a leaf node", () => {
  const tree = createTree();
  const targetNode = tree.children[1];

  const result = applyDrop({
    tree,
    targetNode,
    dropPosition: null,
    canDropInside: false,
    payload: { componentType: "Text" },
  });

  assert.strictEqual(result, tree);
});

test("applyDrop adds palette components with default props", () => {
  const tree = createTree();
  const targetNode = tree.children[0];

  const result = applyDrop({
    tree,
    targetNode,
    dropPosition: "inside",
    canDropInside: true,
    payload: { componentType: "Text" },
  });

  assert.notStrictEqual(result, tree);
  assert.equal(result.children[0].children.length, 1);
  assert.equal(result.children[0].children[0]?.type, "Text");
  assert.deepEqual(result.children[0].children[0]?.props, {
    backgroundColor: "#fefefe",
    border: "1px dashed #aaa",
    borderRadius: "4px",
    padding: "10px",
    text: "change text here",
  });
});

test("applyDrop reuses moveNode protections for invalid descendant moves", () => {
  const tree: BuilderNode = {
    id: "root",
    type: "Container",
    props: {},
    children: [
      {
        id: "parent",
        type: "Container",
        props: {},
        children: [
          {
            id: "child",
            type: "Text",
            props: { text: "Nested" },
            children: [],
          },
        ],
      },
    ],
  };

  const result = applyDrop({
    tree,
    targetNode: tree.children[0].children[0],
    dropPosition: "before",
    canDropInside: false,
    payload: { draggedNodeId: "parent" },
  });

  assert.strictEqual(result, tree);
});

test("applyDrop moves existing nodes without creating duplicates", () => {
  const tree = createTree();

  const result = applyDrop({
    tree,
    targetNode: tree.children[0],
    dropPosition: "left",
    canDropInside: true,
    payload: { draggedNodeId: "button" },
  });

  assert.deepEqual(result.children.map((child) => child.id), ["button", "container"]);
  assert.equal(result.children.length, 2);
});

test("applyDrop converts the parent container to row for left and right insertion", () => {
  const tree = createTree();

  const result = applyDrop({
    tree,
    targetNode: tree.children[0],
    dropPosition: "left",
    canDropInside: true,
    payload: { componentType: "Text" },
  });

  assert.equal(result.props.direction, "row");
});

test("applyDrop prevents sibling insertion when the target is the root container", () => {
  const tree = createTree();

  const result = applyDrop({
    tree,
    targetNode: tree,
    dropPosition: "before",
    canDropInside: true,
    allowSiblingDrop: false,
    payload: { componentType: "Text" },
  });

  assert.strictEqual(result, tree);
});
