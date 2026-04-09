import type { BuilderNode, NodeProps } from "./core/types.ts";

export function createEmptyLayout(rootProps: NodeProps = {}): BuilderNode {
  return {
    id: "root",
    type: "Container",
    props: {
      width: "100%",
      minHeight: "640px",
      padding: "24px",
      border: "1px dashed #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      gap: "12px",
      display: "flex",
      ...rootProps,
    },
    children: [],
  };
}
