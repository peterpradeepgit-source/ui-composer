import { useBuilder } from "../builder/BuilderContext";
import { componentMeta } from "../core/componentMeta";
import { findNode } from "../core/tree";
import PropertyField from "./propertyField";

export function PropertyPanel() {
  const { history, selectedId, updateNodeProperty } = useBuilder();
  if (!selectedId) {
    return (
      <div className="property-panel">
        Select a component to edit its properties
      </div>
    );
  }
  const selectedNode = findNode(history.present, selectedId);

  if (!selectedNode) {
    return <div className="property-panel">Selected component not found</div>;
  }
  const meta = componentMeta.find((m) => m.type === selectedNode.type);
  const schema = meta?.properties || [];

  if (!meta) {
    return (
      <div className="property-panel">
        No metadata found for component type: {selectedNode.type}
      </div>
    );
  }

  return (
    <div className="property-panel">
      <h3>{meta?.label} Properties</h3>
      {/* Render property editors based on meta */}
      {meta?.properties?.map((prop) => (
        <div key={prop.name} className="property-editor">
          <label>{prop.label}</label>
          <PropertyField
            schema={prop}
            value={selectedNode.props[prop.name]}
            onChange={(newValue) => {
              updateNodeProperty(selectedNode.id, {
                [prop.name]: newValue,
              });
            }}
          />
        </div>
      ))}
    </div>
  );
}
