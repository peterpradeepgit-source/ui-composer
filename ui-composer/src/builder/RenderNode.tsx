import { getComponentConfig } from "../core/registy";
import type { BuilderNode } from "../core/types";

export function RenderNode({ node }: { node: BuilderNode }) {
  const entry = getComponentConfig(node.type);
  if (!entry) {
    return <div style={{ color: "red" }}>Component not found: {node.type}</div>;
  }
  const Component = entry.component;

  const { children: propChildren, ...restProps } = node.props || {};
  const renderedChildren =
    node.children && node.children.length > 0
      ? node.children.map((child) => <RenderNode key={child.id} node={child} />)
      : propChildren;

  return <Component {...restProps}>{renderedChildren}</Component>;
}
