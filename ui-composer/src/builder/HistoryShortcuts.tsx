import { useEffect } from "react";
import { useBuilder } from "./useBuilder";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function HistoryShortcuts() {
  const { undo, redo } = useBuilder();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || isEditableTarget(event.target)) {
        return;
      }

      if (event.key.toLowerCase() !== "z") {
        return;
      }

      event.preventDefault();

      if (event.shiftKey) {
        redo();
        return;
      }

      undo();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [redo, undo]);

  return null;
}
