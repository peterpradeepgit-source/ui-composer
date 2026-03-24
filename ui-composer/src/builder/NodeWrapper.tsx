import { useState } from "react";
import type { BuilderNode } from "../core/types";
import { useBuilder } from "./BuilderContext";
import { componentRules } from "../core/componentRules";
import { nanoid } from "nanoid";
import { applyChange } from "../core/history";
import { insertAfter, insertBefore, insertNode, moveNode } from "../core/tree";

type props = {
  node: BuilderNode;
  children: React.ReactNode;
};

export function NodeWrapper({ node, children }: props) {
  const { selectedId, setSelectedId, history, setHistory } = useBuilder();
  const isSeelected = selectedId === node.id;
  const [hover, setHover] = useState(false);
  const [dropHover, setDropHover] = useState(false);
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const canDrop = componentRules[node.type]?.canHaveChildren;

  const indicatorStyle =
    dropPosition === "before"
      ? {
          borderTop: "2px solid #3b83f6",
        }
      : dropPosition === "after"
        ? {
            borderBottom: "2px solid #3b83f6",
          }
        : dropPosition === "inside" && canDrop
          ? {
              backgroundColor: "rgba(59, 131, 246, 0.1)",
            }
          : {};

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    const type = e.dataTransfer.getData("component-type");
    const draggedNodeId = e.dataTransfer.getData("node-id");
    const newTree = structuredClone(history.present);

    if (!type) return;

    const newNode = {
      id: nanoid(),
      type,
      props: {},
      children: [],
    };

    if (dropPosition === "inside") {
      if (!canDrop) return;
      insertNode(newTree, node.id, newNode);
    } else if (dropPosition === "before") {
      insertBefore(newTree, node.id, newNode);
    } else if (dropPosition === "after") {
      insertAfter(newTree, node.id, newNode);
    }
    if (draggedNodeId === node.id) return; // Prevent dropping on itself
    if (draggedNodeId && draggedNodeId !== node.id) {
      // Handle reordering existing node
      moveNode(newTree, draggedNodeId, node.id, dropPosition ?? "inside");
    }
    setHistory(applyChange(history, newTree));
    setDropPosition(null);
    setDropHover(false);
  }
  return (
    <div
      data-node-id={node.id}
      className={`node-wrapper ${isSeelected ? "selected" : ""} ${hover ? "hover" : ""} ${dropHover ? "drop-hover" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(node.id);
      }}
      style={indicatorStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = (e.target as HTMLElement).getBoundingClientRect();

        const offsetY = e.clientY - rect.top;
        const height = rect.height;
        if (offsetY < height * 0.25) {
          setDropPosition("before");
        } else if (offsetY > height * 0.75) {
          setDropPosition("after");
        } else {
          if (canDrop) setDropPosition("inside");
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDropHover(false);
        setDropPosition(null);
      }}
      onDrop={handleDrop}
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData("node-id", node.id);
      }}
    >
      {children}
    </div>
  );
}
