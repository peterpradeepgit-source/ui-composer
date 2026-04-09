import type { BuilderNode, NodeProps } from "./types";

export type InsertPosition = "before" | "after" | "inside" | "left" | "right";

function normalizeInsertPosition(
  position: InsertPosition,
): "before" | "after" | "inside" {
  if (position === "left") {
    return "before";
  }

  if (position === "right") {
    return "after";
  }

  return position;
}

export function findNode(node: BuilderNode, id: string): BuilderNode | null {
  if (node.id === id) {
    return node;
  }

  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) {
      return found;
    }
  }

  return null;
}

export function findParentId(
  node: BuilderNode,
  childId: string,
  parentId: string | null = null,
): string | null {
  if (node.id === childId) {
    return parentId;
  }

  for (const child of node.children) {
    const foundParentId = findParentId(child, childId, node.id);
    if (foundParentId) {
      return foundParentId;
    }
  }

  return null;
}

function insertNodeWithStatus(
  root: BuilderNode,
  parentId: string,
  newNode: BuilderNode,
): { tree: BuilderNode; inserted: boolean } {
  if (root.id === parentId) {
    return {
      tree: { ...root, children: [...root.children, newNode] },
      inserted: true,
    };
  }

  let inserted = false;
  const children = root.children.map((child) => {
    if (inserted) {
      return child;
    }

    const updated = insertNodeWithStatus(child, parentId, newNode);
    if (updated.inserted) {
      inserted = true;
      return updated.tree;
    }

    return child;
  });

  if (!inserted) {
    return { tree: root, inserted: false };
  }

  return { tree: { ...root, children }, inserted: true };
}

function insertSiblingWithStatus(
  root: BuilderNode,
  targetId: string,
  newNode: BuilderNode,
  mode: "before" | "after",
): { tree: BuilderNode; inserted: boolean } {
  const targetIndex = root.children.findIndex((child) => child.id === targetId);
  if (targetIndex !== -1) {
    const children = [...root.children];
    const insertIndex = mode === "before" ? targetIndex : targetIndex + 1;
    children.splice(insertIndex, 0, newNode);
    return { tree: { ...root, children }, inserted: true };
  }

  let inserted = false;
  const children = root.children.map((child) => {
    if (inserted) {
      return child;
    }

    const updated = insertSiblingWithStatus(child, targetId, newNode, mode);
    if (updated.inserted) {
      inserted = true;
      return updated.tree;
    }

    return child;
  });

  if (!inserted) {
    return { tree: root, inserted: false };
  }

  return { tree: { ...root, children }, inserted: true };
}

export function insertBefore(
  root: BuilderNode,
  targetId: string,
  newNode: BuilderNode,
): BuilderNode {
  const result = insertSiblingWithStatus(root, targetId, newNode, "before");
  if (!result.inserted) {
    throw new Error("Target not found");
  }

  return result.tree;
}

export function insertAfter(
  root: BuilderNode,
  targetId: string,
  newNode: BuilderNode,
): BuilderNode {
  const result = insertSiblingWithStatus(root, targetId, newNode, "after");
  if (!result.inserted) {
    throw new Error("Target not found");
  }

  return result.tree;
}

export function insertNode(
  root: BuilderNode,
  parentId: string,
  newNode: BuilderNode,
): BuilderNode {
  const result = insertNodeWithStatus(root, parentId, newNode);
  if (!result.inserted) {
    throw new Error("Parent not found");
  }

  return result.tree;
}

export function updateNode(
  root: BuilderNode,
  nodeId: string,
  newProps: NodeProps,
): BuilderNode {
  return updateNodeRecursive(root, nodeId, newProps);
}

function removeNodeWithStatus(
  root: BuilderNode,
  nodeId: string,
): { tree: BuilderNode; removedNode: BuilderNode | null } {
  const targetIndex = root.children.findIndex((child) => child.id === nodeId);
  if (targetIndex !== -1) {
    const children = [...root.children];
    const [removedNode] = children.splice(targetIndex, 1);
    return { tree: { ...root, children }, removedNode };
  }

  let removedNode: BuilderNode | null = null;
  const children = root.children.map((child) => {
    if (removedNode) {
      return child;
    }

    const updated = removeNodeWithStatus(child, nodeId);
    if (updated.removedNode) {
      removedNode = updated.removedNode;
      return updated.tree;
    }

    return child;
  });

  if (!removedNode) {
    return { tree: root, removedNode: null };
  }

  return { tree: { ...root, children }, removedNode };
}

export function removeNode(
  root: BuilderNode,
  nodeId: string,
): { tree: BuilderNode; removedNode: BuilderNode | null } {
  return removeNodeWithStatus(root, nodeId);
}

function isDescendant(
  root: BuilderNode,
  ancestorId: string,
  targetId: string,
): boolean {
  const ancestor = findNode(root, ancestorId);
  if (!ancestor) {
    return false;
  }

  return findNode(ancestor, targetId) !== null;
}

export function moveNode(
  root: BuilderNode,
  draggedId: string,
  targetId: string,
  position: InsertPosition,
): BuilderNode {
  const normalizedPosition = normalizeInsertPosition(position);

  if (draggedId === targetId || root.id === draggedId) {
    return root;
  }

  if (isDescendant(root, draggedId, targetId)) {
    return root;
  }

  const removal = removeNode(root, draggedId);
  if (!removal.removedNode) {
    throw new Error("Dragged node not found");
  }

  if (normalizedPosition === "inside") {
    return insertNode(removal.tree, targetId, removal.removedNode);
  }

  if (normalizedPosition === "before") {
    return insertBefore(removal.tree, targetId, removal.removedNode);
  }

  return insertAfter(removal.tree, targetId, removal.removedNode);
}

export function updateNodeProps(
  tree: BuilderNode,
  id: string,
  newProps: NodeProps,
): BuilderNode {
  return updateNodeRecursive(tree, id, newProps);
}

export function updateNodeRecursive(
  node: BuilderNode,
  nodeId: string,
  newProps: NodeProps,
): BuilderNode {
  if (node.id === nodeId) {
    return { ...node, props: { ...node.props, ...newProps } };
  }

  if (node.children.length === 0) {
    return node;
  }

  let changed = false;
  const children = node.children.map((child) => {
    const updatedChild = updateNodeRecursive(child, nodeId, newProps);
    if (updatedChild !== child) {
      changed = true;
    }

    return updatedChild;
  });

  return changed ? { ...node, children } : node;
}

export function replaceNodePropsRecursive(
  node: BuilderNode,
  nodeId: string,
  nextProps: NodeProps,
): BuilderNode {
  if (node.id === nodeId) {
    return { ...node, props: nextProps };
  }

  if (node.children.length === 0) {
    return node;
  }

  let changed = false;
  const children = node.children.map((child) => {
    const updatedChild = replaceNodePropsRecursive(child, nodeId, nextProps);
    if (updatedChild !== child) {
      changed = true;
    }

    return updatedChild;
  });

  return changed ? { ...node, children } : node;
}
