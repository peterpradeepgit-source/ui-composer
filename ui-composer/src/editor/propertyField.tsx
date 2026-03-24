import type { PropertyScehema } from "./propertyTypes";

type Props = {
  schema: PropertyScehema;
  value: any;
  onChange: (newValue: any) => void;
};

export default function PropertyField({ schema, value, onChange }: Props) {
  switch (schema.type) {
    case "text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "color":
      return (
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select":
      return (
        <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
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
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "boolean":
      return (
        <input
          type="checkbox"
          checked={!!value}
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
          value={value || 0}
          min={schema.min}
          max={schema.max}
          step={schema.step || 1}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "spacing":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {["top", "right", "bottom", "left"].map((side) => (
            <input
              type="number"
              key={side}
              value={value?.[side] || 0}
              placeholder={side}
              onChange={(e) =>
                onChange({ ...value, [side]: Number(e.target.value) })
              }
            />
          ))}
        </div>
      );
    case "style":
      return (
        <textarea
          value={value || ""}
          placeholder="e.g. color: red; margin: 10px;"
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "image":
      return (
        <input
          type="text"
          value={value || ""}
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
              const parsed = JSON.parse(e.target.value);
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
