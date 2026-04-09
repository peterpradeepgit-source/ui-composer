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

  return (
    <div className="builder-toolbar">
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
        disabled={history.present.children.length === 0}
      >
        Clear
      </button>
      <button
        type="button"
        className="toolbar-button"
        onClick={onToggleProperties}
      >
        {isPropertiesOpen ? ">>" : "<<"}
      </button>
    </div>
  );
}
