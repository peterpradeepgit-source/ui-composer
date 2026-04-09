import { useRegisteredComponents } from "../core/registy";
import { ExternalComponentImporter } from "./ExternalComponentImporter";

type ComponentPaletteProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function ComponentPalette({ isOpen, onToggle }: ComponentPaletteProps) {
  const registeredComponents = useRegisteredComponents();

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
      <ExternalComponentImporter />
      {registeredComponents.map((comp) => (
        <div
          key={comp.type}
          className="component-item"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("component-type", comp.type);
          }}
        >
          <div className="component-item-label">{comp.label}</div>
          {comp.source === "external" ? (
            <div className="component-item-meta">{comp.importPath}</div>
          ) : null}
        </div>
      ))}
    </aside>
  );
}
