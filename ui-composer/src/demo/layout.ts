import type { BuilderNode } from "../core/types";

export const layoutDemo: BuilderNode = {
  id: "root",
  type: "Container",
  props: {
    width: "100%",
    height: "85vh",
    minHeight: "85vh",
    padding: "24px",
    border: "1px dashed #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    gap: "12px",
    display: "flex",
  },
  children: [],
};
