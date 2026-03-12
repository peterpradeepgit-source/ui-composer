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
  parentId: string,
): boolean {
  const parentNode = findNode(root, parentId);
  if (!parentNode) {
    return false;
  }
  const index = parentNode.children.findIndex((child) => child.id === nodeId);
  if (index === -1) {
    return false;
  }
  parentNode.children.splice(index, 1);
  return true;
}

export function moveNode(
  root: BuilderNode,
  nodeId: string,
  newParentId: string,
): boolean {
  const node = findNode(root, nodeId);
  const newParentNode = findNode(root, newParentId);
  if (!node || !newParentNode) {
    return false;
  }
  const parentId = findParentId(root, nodeId);
  if (!parentId) {
    return false;
  }
  removeNode(root, nodeId, parentId);
  newParentNode.children.push(node);
  return true;
}
