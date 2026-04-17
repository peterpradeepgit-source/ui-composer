import { useState } from "react";
import {
  downloadComponentFile,
  exportProjectToDirectory,
} from "../export/exportProject";
import { useBuilder } from "./useBuilder";

type BuilderToolbarProps = {
  isPropertiesOpen: boolean;
  onToggleProperties: () => void;
};

export function BuilderToolbar({
  isPropertiesOpen,
  onToggleProperties,
}: BuilderToolbarProps) {
  const { history, undo, redo, clearCanvas } = useBuilder();
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "success" | "error">("idle");
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const hasExportableDesign = history.present.children.length > 0;

  function handleComponentExport(fileFormat: "tsx" | "jsx") {
    if (!hasExportableDesign) {
      return;
    }

    try {
      const file = downloadComponentFile(history.present, { fileFormat });
      setExportStatus("success");
      setExportMessage(`Downloaded ${file.path}. Import it into any React project.`);
    } catch (error) {
      setExportStatus("error");
      setExportMessage(error instanceof Error ? error.message : "Component export failed.");
    }
  }

  async function handleProjectExport() {
    if (!hasExportableDesign) {
      return;
    }

    setExportStatus("exporting");
    setExportMessage("Choose or create a folder for the exported project.");

    try {
      const files = await exportProjectToDirectory(history.present);
      setExportStatus("success");
      setExportMessage(`Exported ${files.length} files. Run npm install, then npm run dev.`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setExportStatus("idle");
        setExportMessage(null);
        return;
      }

      setExportStatus("error");
      setExportMessage(error instanceof Error ? error.message : "Export failed.");
    }
  }

  return (
    <div className="builder-toolbar" role="toolbar" aria-label="Builder actions">
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
      >
        Clear
      </button>
      <button
        type="button"
        className="toolbar-button toolbar-button-primary"
        onClick={() => handleComponentExport("tsx")}
        disabled={!hasExportableDesign}
      >
        Export TSX
      </button>
      <button
        type="button"
        className="toolbar-button toolbar-button-primary"
        onClick={() => handleComponentExport("jsx")}
        disabled={!hasExportableDesign}
      >
        Export JSX
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={() => void handleProjectExport()}
        disabled={!hasExportableDesign || exportStatus === "exporting"}
      >
        {exportStatus === "exporting" ? "Exporting..." : "Export Project"}
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onToggleProperties}
      >
        {isPropertiesOpen ? ">>" : "<<"}
      </button>
      {exportMessage ? (
        <span className={`toolbar-status toolbar-status-${exportStatus}`}>
          {exportMessage}
        </span>
      ) : null}
    </div>
  );
}
