import { useState } from "react";
import { ExportDialog } from "./ExportDialog";
import {
  downloadDesignJson,
  readDesignJsonFromUserFile,
} from "../export/designJson";
import { useBuilder } from "./useBuilder";

type BuilderToolbarProps = {
  isPropertiesOpen: boolean;
  onToggleProperties: () => void;
};

export function BuilderToolbar({
  isPropertiesOpen,
  onToggleProperties,
}: BuilderToolbarProps) {
  const { history, undo, redo, clearCanvas, replaceTree } = useBuilder();
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "success" | "error">("idle");
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const hasExportableDesign = history.present.children.length > 0;

  function updateExportStatus(
    status: "idle" | "exporting" | "success" | "error",
    message: string | null,
  ) {
    setExportStatus(status);
    setExportMessage(message);
  }

  function handleSaveDesign() {
    if (!hasExportableDesign) {
      return;
    }

    try {
      const file = downloadDesignJson(history.present);
      setExportStatus("success");
      setExportMessage(`Saved ${file.path}.`);
    } catch (error) {
      setExportStatus("error");
      setExportMessage(error instanceof Error ? error.message : "Design save failed.");
    }
  }

  async function handleLoadDesign() {
    try {
      const design = await readDesignJsonFromUserFile();
      replaceTree(design);
      setExportStatus("success");
      setExportMessage("Loaded design JSON.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setExportStatus("error");
      setExportMessage(error instanceof Error ? error.message : "Design load failed.");
    }
  }

  return (
    <>
      <div className="builder-toolbar" role="toolbar" aria-label="Builder actions">
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            onClick={undo}
            disabled={history.past.length === 0}
          >
            Undo
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={redo}
            disabled={history.future.length === 0}
          >
            Redo
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={clearCanvas}
            disabled={!hasExportableDesign}
            title={hasExportableDesign ? "Clear the canvas" : "Add a component before clearing"}
          >
            Clear
          </button>
        </div>
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-button"
            onClick={handleSaveDesign}
            disabled={!hasExportableDesign}
            title={hasExportableDesign ? "Download design JSON" : "Add a component before saving"}
          >
            Save JSON
          </button>
          <button
            type="button"
            className="toolbar-button"
            onClick={() => void handleLoadDesign()}
          >
            Load JSON
          </button>
          <button
            type="button"
            className="toolbar-button toolbar-button-primary"
            onClick={() => setIsExportDialogOpen(true)}
            disabled={!hasExportableDesign || exportStatus === "exporting"}
            title={hasExportableDesign ? "Export generated code" : "Add a component before exporting"}
          >
            Export
          </button>
        </div>
        <button
          type="button"
          className="toolbar-button toolbar-button-ghost"
          onClick={onToggleProperties}
        >
          {isPropertiesOpen ? "Hide Props" : "Show Props"}
        </button>
        {exportMessage ? (
          <span className={`toolbar-status toolbar-status-${exportStatus}`}>
            {exportMessage}
          </span>
        ) : null}
      </div>
      <ExportDialog
        design={history.present}
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onStatusChange={updateExportStatus}
      />
    </>
  );
}
