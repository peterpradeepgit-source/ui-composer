import { Component } from "react";
import { getComponentConfig } from "../core/registy";
import type { BuilderNode } from "../core/types";
import { NodeWrapper } from "./NodeWrapper";

export function RenderNode({ node }: { node: BuilderNode }) {
  const componentConfig = getComponentConfig(node.type);
  if (!componentConfig) {
    return <div style={{ color: "red" }}>Unknown component: {node.type}</div>;
  }

  return (
    <NodeWrapper node={node}>
      <Component {...node.props}>
        {node.children?.map((child) => (
          <RenderNode key={child.id} node={child} />
        ))}
      </Component>
    </NodeWrapper>
  );
}
