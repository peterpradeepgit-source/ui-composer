import { createContext } from "react";
import type { HistoryState } from "../core/history";
import type { BuilderNode, NodeProps } from "../core/types";

export type BuilderContextType = {
  history: HistoryState;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  applyTreeChange: (nextTree: BuilderNode) => void;
  updateNodeProperty: (nodeId: string, newProps: NodeProps) => void;
  replaceNodeProperties: (nodeId: string, nextProps: NodeProps) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
};

export const BuilderContext = createContext<BuilderContextType | undefined>(
  undefined,
);
