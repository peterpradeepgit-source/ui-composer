import { useState } from "react";
import type { BuilderNode } from "../core/types";
import { componentRules } from "../core/componentRules";
import { applyChange } from "../core/history";
import { applyDrop, getDropPosition } from "./drop.ts";
import { useBuilder } from "./useBuilder";

type Props = {
  node: BuilderNode;
  children: React.ReactNode;
  isDraggable?: boolean;
};

export function NodeWrapper({
  node,
  children,
  isDraggable = true,
}: Props) {
  const { selectedId, setSelectedId, history, setHistory } = useBuilder();
  const isSelected = selectedId === node.id;
  const [hover, setHover] = useState(false);
  const [dropHover, setDropHover] = useState(false);
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const canDrop = componentRules[node.type]?.canHaveChildren;

  const indicatorStyle =
    dropPosition === "before"
      ? { borderTop: "2px solid #3b83f6" }
      : dropPosition === "after"
        ? { borderBottom: "2px solid #3b83f6" }
        : dropPosition === "inside" && canDrop
          ? { backgroundColor: "rgba(59, 131, 246, 0.1)" }
          : {};

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData("component-type");
    const draggedNodeId = e.dataTransfer.getData("node-id");

    if (!componentType && !draggedNodeId) {
      return;
    }

    const newTree = applyDrop({
      tree: history.present,
      targetNode: node,
      dropPosition,
      canDropInside: Boolean(canDrop),
      payload: {
        componentType: componentType || undefined,
        draggedNodeId: draggedNodeId || undefined,
      },
    });

    if (newTree === history.present) {
      setDropPosition(null);
      setDropHover(false);
      return;
    }

    setHistory(applyChange(history, newTree));
    setDropPosition(null);
    setDropHover(false);
  }

  return (
    <div
      data-node-id={node.id}
      draggable={isDraggable}
      className={`node-wrapper ${isSelected ? "selected" : ""} ${hover ? "hover" : ""} ${dropHover ? "drop-hover" : ""}`}
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
        setDropHover(true);

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        setDropPosition(getDropPosition(offsetY, rect.height, Boolean(canDrop)));
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDropHover(false);
        setDropPosition(null);
      }}
      onDrop={handleDrop}
      onDragStart={(e) => {
        if (!isDraggable) {
          e.preventDefault();
          return;
        }

        e.stopPropagation();
        e.dataTransfer.setData("node-id", node.id);
      }}
    >
      {children}
    </div>
  );
}
