import { useState } from "react";
import type { BuilderNode } from "../core/types";
import { canComponentHaveChildren } from "../core/registy";
import { applyDrop, getDropPosition } from "./drop.ts";
import { useBuilder } from "./useBuilder";

type Props = {
  node: BuilderNode;
  children: React.ReactNode;
  isDraggable?: boolean;
  isRoot?: boolean;
};

export function NodeWrapper({
  node,
  children,
  isDraggable = true,
  isRoot = false,
}: Props) {
  const { selectedId, setSelectedId, history, applyTreeChange } = useBuilder();
  const isSelected = selectedId === node.id;
  const [hover, setHover] = useState(false);
  const [dropHover, setDropHover] = useState(false);
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | "left" | "right" | null
  >(null);
  const canDrop = canComponentHaveChildren(node.type);

  const indicatorStyle =
    dropPosition === "before"
      ? { "--drop-indicator-color": "#3b83f6" } as React.CSSProperties
      : dropPosition === "after"
        ? { "--drop-indicator-color": "#3b83f6" } as React.CSSProperties
        : dropPosition === "left"
          ? { "--drop-indicator-color": "#3b83f6" } as React.CSSProperties
          : dropPosition === "right"
            ? { "--drop-indicator-color": "#3b83f6" } as React.CSSProperties
        : dropPosition === "inside" && canDrop
          ? { "--drop-indicator-color": "#3b83f6" } as React.CSSProperties
          : {};

  const dropIndicatorLabel =
    dropPosition === "inside"
      ? "Drop inside"
      : dropPosition === "before"
        ? "Insert above"
        : dropPosition === "after"
          ? "Insert below"
          : dropPosition === "left"
            ? "Insert left"
            : dropPosition === "right"
              ? "Insert right"
              : null;

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
      allowSiblingDrop: !isRoot,
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

    applyTreeChange(newTree);
    setDropPosition(null);
    setDropHover(false);
  }

  return (
    <div
      data-node-id={node.id}
      draggable={isDraggable}
      className={`node-wrapper ${isRoot ? "node-wrapper-root" : ""} ${isSelected ? "selected" : ""} ${hover ? "hover" : ""} ${dropHover ? "drop-hover" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(node.id);
      }}
      style={indicatorStyle}
      data-drop-position={dropPosition ?? undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropHover(true);

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        setDropPosition(
          getDropPosition(
            offsetX,
            offsetY,
            rect.width,
            rect.height,
            Boolean(canDrop),
            !isRoot,
            !isRoot,
          ),
        );
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
      <div className="node-wrapper-content">{children}</div>
      {dropHover && dropPosition ? (
        <div className={`drop-indicator drop-indicator-${dropPosition}`}>
          <span>{dropIndicatorLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
