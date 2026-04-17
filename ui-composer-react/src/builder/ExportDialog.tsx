import { useState } from "react";
import {
  downloadComponentFile,
  exportProjectToDirectory,
  generateComponentFile,
  type GeneratedProjectFile,
} from "../export/exportProject";
import type { BuilderNode } from "../core/types";

type ExportDialogProps = {
  design: BuilderNode;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: "idle" | "exporting" | "success" | "error", message: string | null) => void;
};

type ExportMode = "tsx" | "jsx" | "project";

export function ExportDialog({
  design,
  isOpen,
  onClose,
  onStatusChange,
}: ExportDialogProps) {
  const [mode, setMode] = useState<ExportMode>("tsx");
  const [componentName, setComponentName] = useState("GeneratedDesign");
  const [fileName, setFileName] = useState("GeneratedDesign");
  const [projectName, setProjectName] = useState("exported-ui-composer-design");
  const [includeStylesImport, setIncludeStylesImport] = useState(true);

  if (!isOpen) {
    return null;
  }

  const previewFile: GeneratedProjectFile | null =
    mode === "project"
      ? null
      : generateComponentFile(design, {
          componentName,
          fileName,
          fileFormat: mode,
          includeStylesImport,
        });

  function handleComponentDownload() {
    const file = downloadComponentFile(design, {
      componentName,
      fileName,
      fileFormat: mode === "jsx" ? "jsx" : "tsx",
      includeStylesImport,
    });

    onStatusChange("success", `Downloaded ${file.path}.`);
    onClose();
  }

  async function handleProjectExport() {
    onStatusChange("exporting", "Choose or create a folder for the exported project.");

    try {
      const files = await exportProjectToDirectory(design, { projectName });
      onStatusChange("success", `Exported ${files.length} files. Run npm install, then npm run dev.`);
      onClose();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        onStatusChange("idle", null);
        return;
      }

      onStatusChange("error", error instanceof Error ? error.message : "Export failed.");
    }
  }

  function handleExport() {
    if (mode === "project") {
      void handleProjectExport();
      return;
    }

    try {
      handleComponentDownload();
    } catch (error) {
      onStatusChange(
        "error",
        error instanceof Error ? error.message : "Component export failed.",
      );
    }
  }

  return (
    <div className="export-dialog-backdrop" role="presentation">
      <section
        className="export-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
      >
        <div className="export-dialog-header">
          <div>
            <p className="eyebrow">Export</p>
            <h2 id="export-dialog-title">Ship this design</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="export-mode-grid">
          {(["tsx", "jsx", "project"] as ExportMode[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`export-mode-card ${mode === option ? "export-mode-card-active" : ""}`}
              onClick={() => setMode(option)}
            >
              <strong>
                {option === "tsx"
                  ? "TSX component"
                  : option === "jsx"
                    ? "JSX component"
                    : "Runnable app"}
              </strong>
              <span>
                {option === "project"
                  ? "Create a full Vite project folder."
                  : "Download one reusable component file."}
              </span>
            </button>
          ))}
        </div>

        {mode === "project" ? (
          <label className="export-field">
            Project name
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="exported-ui-composer-design"
            />
          </label>
        ) : (
          <div className="export-form-grid">
            <label className="export-field">
              Component name
              <input
                value={componentName}
                onChange={(event) => setComponentName(event.target.value)}
                placeholder="GeneratedDesign"
              />
            </label>
            <label className="export-field">
              File name
              <input
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder="GeneratedDesign"
              />
            </label>
            <label className="export-checkbox">
              <input
                type="checkbox"
                checked={includeStylesImport}
                onChange={(event) => setIncludeStylesImport(event.target.checked)}
              />
              Include package stylesheet import
            </label>
          </div>
        )}

        {previewFile ? (
          <div className="export-preview">
            <div className="export-preview-header">
              <span>{previewFile.path}</span>
              <span>{previewFile.contents.split("\n").length} lines</span>
            </div>
            <pre>{previewFile.contents}</pre>
          </div>
        ) : (
          <div className="export-project-note">
            The full project export writes a runnable app into the folder you choose.
          </div>
        )}

        <div className="export-dialog-actions">
          <button type="button" className="toolbar-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="toolbar-button toolbar-button-primary" onClick={handleExport}>
            {mode === "project" ? "Choose Folder" : `Download ${mode.toUpperCase()}`}
          </button>
        </div>
      </section>
    </div>
  );
}
