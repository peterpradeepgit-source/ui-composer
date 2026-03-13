import { useState } from "react";
import type { BuilderNode } from "../core/types";
import { useBuilder } from "./BuilderContext";

type props = {
  node: BuilderNode;
  children: React.ReactNode;
};

export function NodeWrapper({ node, children }: props) {
  const { selectedId, setSelectedId } = useBuilder();
  const isSeelected = selectedId === node.id;
  const [hover, setHover] = useState(false);
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
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </div>
  );
}
