import { componentMeta } from "../core/componentMeta";

type ComponentPaletteProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function ComponentPalette({ isOpen, onToggle }: ComponentPaletteProps) {
  if (!isOpen) {
    return (
      <aside className="side-rail">
        <button type="button" className="rail-button" onClick={onToggle}>
          Show Components
        </button>
      </aside>
    );
  }

  return (
    <aside className="component-palette">
      <div className="side-panel-header">
        <h3>Components</h3>
        <button type="button" className="panel-toggle-button" onClick={onToggle}>
          {"<<"}
        </button>
      </div>
      {componentMeta.map((comp) => (
        <div
          key={comp.type}
          className="component-item"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("component-type", comp.type);
          }}
        >
          {comp.label}
        </div>
      ))}
    </aside>
  );
}
