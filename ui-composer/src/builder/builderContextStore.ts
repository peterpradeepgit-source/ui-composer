import { createContext } from "react";
import type { HistoryState } from "../core/history";
import type { NodeProps } from "../core/types";

export type BuilderContextType = {
  history: HistoryState;
  setHistory: React.Dispatch<React.SetStateAction<HistoryState>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateNodeProperty: (nodeId: string, newProps: NodeProps) => void;
};

export const BuilderContext = createContext<BuilderContextType | undefined>(
  undefined,
);
