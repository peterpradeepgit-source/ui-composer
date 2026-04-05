import { nanoid } from "nanoid";
import { componentMeta } from "../core/componentMeta.ts";
import {
  findNode,
  findParentId,
  insertAfter,
  insertBefore,
  insertNode,
  moveNode,
  updateNodeRecursive,
} from "../core/tree.ts";
import type { BuilderNode } from "../core/types";

export type DropPosition =
  | "before"
  | "after"
  | "inside"
  | "left"
  | "right"
  | null;

export type DropPayload = {
  componentType?: string;
  draggedNodeId?: string;
};

type ApplyDropArgs = {
  tree: BuilderNode;
  targetNode: BuilderNode;
  dropPosition: DropPosition;
  canDropInside: boolean;
  allowSiblingDrop?: boolean;
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

function normalizeDropPosition(
  position: Exclude<DropPosition, null>,
): "before" | "after" | "inside" {
  if (position === "left") {
    return "before";
  }

  if (position === "right") {
    return "after";
  }

  return position;
}

function ensureHorizontalSiblingLayout(
  tree: BuilderNode,
  targetNode: BuilderNode,
  dropPosition: DropPosition,
): BuilderNode {
  if (dropPosition !== "left" && dropPosition !== "right") {
    return tree;
  }

  const parentId = findParentId(tree, targetNode.id);
  if (!parentId) {
    return tree;
  }

  const parentNode = findNode(tree, parentId);
  if (!parentNode || parentNode.type !== "Container") {
    return tree;
  }

  if (parentNode.props.direction === "row") {
    return tree;
  }

  return updateNodeRecursive(tree, parentId, { direction: "row" });
}

export function getDropPosition(
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  canDropInside: boolean,
  allowSiblingDrop: boolean = true,
  allowHorizontalSiblingDrop: boolean = true,
): DropPosition {
  if (!allowSiblingDrop) {
    return canDropInside ? "inside" : null;
  }

  const edgeInset = Math.min(Math.max(height * 0.35, 18), 48);

  if (allowHorizontalSiblingDrop && width > 120) {
    if (offsetX < width * 0.2) {
      return "left";
    }

    if (offsetX > width * 0.8) {
      return "right";
    }
  }

  if (offsetY <= edgeInset) {
    return "before";
  }

  if (offsetY >= height - edgeInset) {
    return "after";
  }

  return canDropInside ? "inside" : null;
}

export function applyDrop({
  tree,
  targetNode,
  dropPosition,
  canDropInside,
  allowSiblingDrop = true,
  payload,
}: ApplyDropArgs): BuilderNode {
  const { componentType, draggedNodeId } = payload;
  const preparedTree = ensureHorizontalSiblingLayout(tree, targetNode, dropPosition);
  const insertionPosition = dropPosition ? normalizeDropPosition(dropPosition) : null;

  if (!componentType && !draggedNodeId) {
    return tree;
  }

  if (!insertionPosition) {
    return tree;
  }

  if (!allowSiblingDrop && insertionPosition !== "inside") {
    return tree;
  }

  if (draggedNodeId) {
    return moveNode(preparedTree, draggedNodeId, targetNode.id, insertionPosition);
  }

  if (!componentType) {
    return tree;
  }

  if (insertionPosition === "inside" && !canDropInside) {
    return tree;
  }

  const newNode = createNode(componentType);

  if (insertionPosition === "inside") {
    return insertNode(preparedTree, targetNode.id, newNode);
  }

  if (insertionPosition === "before") {
    return insertBefore(preparedTree, targetNode.id, newNode);
  }

  return insertAfter(preparedTree, targetNode.id, newNode);
}
