import type { BuilderNode } from "./types";

export type HistoryState = {
  past: BuilderNode[];
  present: BuilderNode;
  future: BuilderNode[];
};

export const MAX_HISTORY_LENGTH = 25;

export function createHistory(initialState: BuilderNode): HistoryState {
  return {
    past: [],
    present: initialState,
    future: [],
  };
}

export function applyChange(
  history: HistoryState,
  newState: BuilderNode,
): HistoryState {
  if (history.present === newState) {
    return history;
  }

  return {
    past: [...history.past, history.present].slice(-MAX_HISTORY_LENGTH), // Keep only the last N states to limit memory usage
    present: newState,
    future: [],
  };
}

export function undo(history: HistoryState): HistoryState {
  if (history.past.length === 0) {
    return history; // No past state to undo to
  }
  const previousState = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, history.past.length - 1);
  return {
    past: newPast,
    present: previousState,
    future: [history.present, ...history.future],
  };
}

export function redo(history: HistoryState): HistoryState {
  if (history.future.length === 0) {
    return history; // No future state to redo to
  }
  const nextState = history.future[0];
  const newFuture = history.future.slice(1);
  return {
    past: [...history.past, history.present],
    present: nextState,
    future: newFuture,
  };
}
