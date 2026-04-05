import { nanoid } from "nanoid";
import { componentMeta } from "../core/componentMeta.ts";
import { insertAfter, insertBefore, insertNode, moveNode } from "../core/tree.ts";
import type { BuilderNode } from "../core/types";

export type DropPosition = "before" | "after" | "inside" | null;

export type DropPayload = {
  componentType?: string;
  draggedNodeId?: string;
};

type ApplyDropArgs = {
  tree: BuilderNode;
  targetNode: BuilderNode;
  dropPosition: DropPosition;
  canDropInside: boolean;
  payload: DropPayload;
};

function createNode(componentType: string): BuilderNode {
  const meta = componentMeta.find((item) => item.type === componentType);

  return {
    id: nanoid(),
    type: componentType,
    props: meta?.defaultProps ?? {},
    children: [],
  };
}

export function getDropPosition(
  offsetY: number,
  height: number,
  canDropInside: boolean,
): DropPosition {
  if (offsetY < height * 0.25) {
    return "before";
  }

  if (offsetY > height * 0.75) {
    return "after";
  }

  return canDropInside ? "inside" : null;
}

export function applyDrop({
  tree,
  targetNode,
  dropPosition,
  canDropInside,
  payload,
}: ApplyDropArgs): BuilderNode {
  const { componentType, draggedNodeId } = payload;

  if (!componentType && !draggedNodeId) {
    return tree;
  }

  if (!dropPosition) {
    return tree;
  }

  let nextTree = tree;

  if (componentType) {
    if (dropPosition === "inside" && !canDropInside) {
      return tree;
    }

    const newNode = createNode(componentType);

    if (dropPosition === "inside") {
      nextTree = insertNode(nextTree, targetNode.id, newNode);
    } else if (dropPosition === "before") {
      nextTree = insertBefore(nextTree, targetNode.id, newNode);
    } else {
      nextTree = insertAfter(nextTree, targetNode.id, newNode);
    }
  }

  if (draggedNodeId && draggedNodeId !== targetNode.id) {
    nextTree = moveNode(nextTree, draggedNodeId, targetNode.id, dropPosition);
  }

  return nextTree;
}
