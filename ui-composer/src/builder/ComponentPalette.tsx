import { defaultComponentMeta } from "../core/componentMeta";

export function ComponentPalette() {
  return (
    <div
      style={{ width: "200px", padding: "10px", borderRight: "1px solid #ddd" }}
    >
      <h3>Components</h3>
      {defaultComponentMeta.map((comp) => (
        <div
          key={comp.type}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("component-type", comp.type);
          }}
          style={{
            padding: "5px",
            marginBottom: "5px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "grab",
          }}
        >
          {comp.label}
        </div>
      ))}
    </div>
  );
}
