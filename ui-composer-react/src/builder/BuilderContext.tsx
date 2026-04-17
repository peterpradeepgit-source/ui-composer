import { useCallback, useMemo, useState } from "react";
import {
  applyChange,
  createHistory,
  redo as redoHistory,
  type HistoryState,
  undo as undoHistory,
} from "../core/history";
import type { BuilderNode, NodeProps } from "../core/types";
import { replaceNodePropsRecursive, updateNodeRecursive } from "../core/tree";
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

  const replaceNodeProperties = useCallback((nodeId: string, nextProps: NodeProps) => {
    setHistory((currentHistory) => {
      const newTree = replaceNodePropsRecursive(
        currentHistory.present,
        nodeId,
        nextProps,
      );
      return applyChange(currentHistory, newTree);
    });
  }, []);

  const replaceTree = useCallback((nextTree: BuilderNode) => {
    setHistory((currentHistory) => applyChange(currentHistory, nextTree));
    setSelectedId(nextTree.id);
  }, []);

  const clearCanvas = useCallback(() => {
    setHistory((currentHistory) => {
      const clearedTree: BuilderNode = {
        ...currentHistory.present,
        children: [],
      };

      return applyChange(currentHistory, clearedTree);
    });
    setSelectedId("root");
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
      replaceNodeProperties,
      replaceTree,
      clearCanvas,
      undo,
      redo,
    }),
    [
      history,
      selectedId,
      applyTreeChange,
      updateNodeProperty,
      replaceNodeProperties,
      replaceTree,
      clearCanvas,
      undo,
      redo,
    ],
  );

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
};
