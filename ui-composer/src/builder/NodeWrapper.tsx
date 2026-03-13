import { useState } from "react";
import type { BuilderNode } from "../core/types";
import { useBuilder } from "./BuilderContext";
import { componentRules } from "../core/componentRules";
import { nanoid } from "nanoid";
import { applyChange } from "../core/history";
import { insertNode } from "../core/tree";

type props = {
  node: BuilderNode;
  children: React.ReactNode;
};

export function NodeWrapper({ node, children }: props) {
  const { selectedId, setSelectedId, history, setHistory } = useBuilder();
  const isSeelected = selectedId === node.id;
  const [hover, setHover] = useState(false);
  const [dropHover, setDropHover] = useState(false);

  const isSelected = selectedId === node.id;
  const canDrop = componentRules[node.type]?.canHaveChildren;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData("component-type");
    if (!type || !canDrop) return;

    const newNode = {
      id: nanoid(),
      type,
      props: {},
      children: [],
    };
    const newTree = structuredClone(history.present);
    insertNode(newTree, node.id, newNode);
    setHistory(applyChange(history, newTree));
    setDropHover(false);
  }
  return (
    <div
      data-node-id={node.id}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(node.id);
      }}
      style={{
        outline: isSeelected
          ? "2px solid blue"
          : hover
            ? "1px dashed gray"
            : "none",
        position: "relative",
        background: dropHover ? "rgba(0,0,255,0.1)" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={(e) => {
        if (canDrop) {
          e.preventDefault();
          setDropHover(true);
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDropHover(false);
      }}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
}
