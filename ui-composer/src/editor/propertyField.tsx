import type { NodePropValue } from "../core/types";
import type { PropertyScehema } from "./propertyTypes";

type Props = {
  schema: PropertyScehema;
  value: NodePropValue;
  onChange: (newValue: NodePropValue) => void;
};

export default function PropertyField({ schema, value, onChange }: Props) {
  switch (schema.type) {
    case "text":
      return (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={typeof value === "number" ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "color":
      return (
        <input
          type="color"
          value={typeof value === "string" ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select":
      return (
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {schema.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "textarea":
      return (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "boolean":
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case "radio":
      return (
        <>
          {schema.options?.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={schema.name}
                checked={value === option}
                onChange={() => onChange(option)}
              />
              {option}
            </label>
          ))}
        </>
      );
    case "range":
      return (
        <input
          type="range"
          value={typeof value === "number" ? value : 0}
          min={schema.min}
          max={schema.max}
          step={schema.step || 1}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "spacing": {
      const spacingValue =
        typeof value === "object" && value !== null && !Array.isArray(value)
          ? (value as Record<string, NodePropValue>)
          : {};

      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {["top", "right", "bottom", "left"].map((side) => (
            <input
              type="number"
              key={side}
              value={
                typeof spacingValue[side] === "number"
                  ? Number(spacingValue[side])
                  : 0
              }
              placeholder={side}
              onChange={(e) =>
                onChange({ ...spacingValue, [side]: Number(e.target.value) })
              }
            />
          ))}
        </div>
      );
    }
    case "style":
      return (
        <textarea
          value={typeof value === "string" ? value : ""}
          placeholder="e.g. color: red; margin: 10px;"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "image":
      return (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          placeholder="Image URL"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "json":
      return (
        <textarea
          value={value ? JSON.stringify(value, null, 2) : ""}
          placeholder="Enter JSON"
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value) as NodePropValue;
              onChange(parsed);
            } catch {
              console.warn("Invalid JSON");
            }
          }}
        />
      );
    default:
      return null;
  }
}
