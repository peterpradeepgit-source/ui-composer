import { useBuilder } from "../builder/useBuilder";
import { getComponentMeta } from "../core/registy";
import { findNode } from "../core/tree";
import type { NodeProps } from "../core/types";
import PropertyField from "./propertyField";

type PropertyPanelProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function PropertyPanel({ isOpen, onToggle }: PropertyPanelProps) {
  const { history, selectedId, updateNodeProperty, replaceNodeProperties } = useBuilder();

  if (!isOpen) {
    return (
      <aside className="side-rail side-rail-right">
        <button type="button" className="rail-button" onClick={onToggle}>
          Show Properties
        </button>
      </aside>
    );
  }

  if (!selectedId) {
    return (
      <aside className="property-panel">
        <div className="side-panel-header">
          <h3>Properties</h3>
          <button type="button" className="panel-toggle-button" onClick={onToggle}>
            {">>"}
          </button>
        </div>
        Select a component to edit its properties
      </aside>
    );
  }
  const selectedNode = findNode(history.present, selectedId);

  if (!selectedNode) {
    return (
      <aside className="property-panel">
        <div className="side-panel-header">
          <h3>Properties</h3>
          <button type="button" className="panel-toggle-button" onClick={onToggle}>
            {">>"}
          </button>
        </div>
        Selected component not found
      </aside>
    );
  }
  const meta = getComponentMeta(selectedNode.type);

  if (!meta) {
    return (
      <aside className="property-panel">
        <div className="side-panel-header">
          <h3>Properties</h3>
          <button type="button" className="panel-toggle-button" onClick={onToggle}>
            {">>"}
          </button>
        </div>
        No metadata found for component type: {selectedNode.type}
      </aside>
    );
  }

  return (
    <aside className="property-panel">
      <div className="side-panel-header">
        <h3>{meta?.label} Properties</h3>
        <button type="button" className="panel-toggle-button" onClick={onToggle}>
          {">>"}
        </button>
      </div>
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
      <div className="property-editor">
        <label>All Props (JSON)</label>
        <PropertyField
          schema={{ name: "__allProps", label: "All Props", type: "json" }}
          value={selectedNode.props}
          onChange={(newValue) => {
            if (
              typeof newValue === "object" &&
              newValue !== null &&
              !Array.isArray(newValue)
            ) {
              replaceNodeProperties(
                selectedNode.id,
                newValue as NodeProps,
              );
            }
          }}
        />
      </div>
    </aside>
  );
}
