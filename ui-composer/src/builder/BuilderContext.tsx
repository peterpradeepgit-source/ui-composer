import { useState } from "react";
import { applyChange, createHistory, type HistoryState } from "../core/history";
import type { BuilderNode, NodeProps } from "../core/types";
import { updateNodeRecursive } from "../core/tree";
import { BuilderContext } from "./builderContextStore";

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

  const updateNodeProperty = (nodeId: string, newProps: NodeProps) => {
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
