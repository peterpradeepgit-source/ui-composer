import { createContext, useContext, useState } from "react";
import { applyChange, createHistory, type HistoryState } from "../core/history";
import type { BuilderNode } from "../core/types";
import { updateNodeRecursive } from "../core/tree";

type BuilderContextType = {
  history: HistoryState;
  setHistory: React.Dispatch<React.SetStateAction<HistoryState>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateNodeProperty: (nodeId: string, newProps: Record<string, any>) => void;
};

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider = ({
  initialLayout,
  children,
}: {
  initialLayout: BuilderNode;
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<HistoryState>(
    createHistory(initialLayout),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateNodeProperty = (
    nodeId: string,
    newProps: Record<string, any>,
  ) => {
    const newTree = updateNodeRecursive(history.present, nodeId, newProps);
    setHistory(applyChange(history, newTree));
  };
  return (
    <BuilderContext.Provider
      value={{
        history,
        setHistory,
        selectedId,
        setSelectedId,
        updateNodeProperty,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
