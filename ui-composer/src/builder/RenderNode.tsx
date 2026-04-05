import { getComponentConfig } from "../core/registy";
import type { BuilderNode } from "../core/types";
import { NodeWrapper } from "./NodeWrapper";

type Props = {
  node: BuilderNode;
  isRoot?: boolean;
};

export function RenderNode({ node, isRoot = false }: Props) {
  const componentConfig = getComponentConfig(node.type);
  if (!componentConfig) {
    return <div style={{ color: "red" }}>Unknown component: {node.type}</div>;
  }

  const Component = componentConfig.component;
  const { children: propChildren, ...restProps } = node.props || {};
  const renderedChildren =
    node.children && node.children.length > 0
      ? node.children.map((child) => <RenderNode key={child.id} node={child} />)
      : propChildren;

  return (
    <NodeWrapper node={node} isDraggable={!isRoot}>
      <Component {...restProps}>{renderedChildren}</Component>
    </NodeWrapper>
  );
}
