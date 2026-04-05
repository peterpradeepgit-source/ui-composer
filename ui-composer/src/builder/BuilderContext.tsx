import { useCallback, useMemo, useState } from "react";
import {
  applyChange,
  createHistory,
  redo as redoHistory,
  type HistoryState,
  undo as undoHistory,
} from "../core/history";
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

  const applyTreeChange = useCallback((nextTree: BuilderNode) => {
    setHistory((currentHistory) => applyChange(currentHistory, nextTree));
  }, []);

  const updateNodeProperty = useCallback((nodeId: string, newProps: NodeProps) => {
    setHistory((currentHistory) => {
      const newTree = updateNodeRecursive(currentHistory.present, nodeId, newProps);
      return applyChange(currentHistory, newTree);
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((currentHistory) => undoHistory(currentHistory));
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => redoHistory(currentHistory));
  }, []);

  const value = useMemo(
    () => ({
      history,
      selectedId,
      setSelectedId,
      applyTreeChange,
      updateNodeProperty,
      undo,
      redo,
    }),
    [history, selectedId, applyTreeChange, updateNodeProperty, undo, redo],
  );

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
