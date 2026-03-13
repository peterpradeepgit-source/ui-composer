import type { BuilderNode } from "./types";

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

export function findParent(
  root: BuilderNode,
  nodeId: string,
): { parent: BuilderNode | null; index: number } {
  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i];
    if (child.id === nodeId) {
      return { parent: root, index: i };
    }
    const result = findParent(child, nodeId);
    if (result.parent) {
      return result;
    }
  }
  return { parent: null, index: -1 };
}

export function insertBefore(
  root: BuilderNode,
  targetId: string,
  newNode: BuilderNode,
) {
  const { parent, index } = findParent(root, targetId);
  if (!parent) {
    throw new Error("Parent not found");
  }
  parent.children.splice(index, 0, newNode);
}

export function insertAfter(
  root: BuilderNode,
  targetId: string,
  newNode: BuilderNode,
) {
  const { parent, index } = findParent(root, targetId);
  if (!parent) {
    throw new Error("Parent not found");
  }
  parent.children.splice(index + 1, 0, newNode);
}

export function insertNode(
  root: BuilderNode,
  parentId: string,
  newNode: BuilderNode,
): BuilderNode | null {
  // Return a new tree with the node inserted. Do not mutate the original tree.
  if (root.id === parentId) {
    return { ...root, children: [...root.children, newNode] };
  }

  let inserted = false;
  const newChildren = root.children.map((child) => {
    if (inserted) return child;
    const updatedChild = insertNode(child, parentId, newNode);
    if (updatedChild) {
      inserted = true;
      return updatedChild;
    }
    return child;
  });

  return inserted ? { ...root, children: newChildren } : null;
}

export function updateNode(
  root: BuilderNode,
  nodeId: string,
  newProps: Record<string, any>,
): boolean {
  const node = findNode(root, nodeId);
  if (!node) {
    return false;
  }
  node.props = { ...node.props, ...newProps };
  return true;
}

export function removeNode(
  root: BuilderNode,
  nodeId: string,
): BuilderNode | null {
  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i];
    if (child.id === nodeId) {
      return root.children.splice(i, 1)[0];
    }

    const removed = removeNode(child, nodeId);
    if (removed) {
      return removed;
    }
  }
  return null;
}

export function moveNode(
  root: BuilderNode,
  draggedId: string,
  targetId: string,
  position: "before" | "after" | "inside",
) {
  const draggedNode = removeNode(root, draggedId);
  if (!draggedNode) {
    throw new Error("Dragged node not found");
  }
  if (position === "inside") {
    insertNode(root, targetId, draggedNode);
  } else if (position === "before") {
    insertBefore(root, targetId, draggedNode);
  } else if (position === "after") {
    insertAfter(root, targetId, draggedNode);
  }
}
