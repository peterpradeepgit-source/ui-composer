import { componentMeta } from "../core/componentMeta";

export function ComponentPalette() {
  return (
    <div className="component-palette">
      <h3>Components</h3>
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
    </div>
  );
}
