import type { NodePropValue } from "../core/types";

export type PropertyType =
  | "text"
  | "number"
  | "color"
  | "select"
  | "textarea"
  | "boolean"
  | "radio"
  | "range"
  | "spacing"
  | "style"
  | "image"
  | "json";

export interface PropertyScehema {
  name: string;
  label: string;
  type: PropertyType;
  defaultValue?: NodePropValue;
  options?: string[]; // For select type
  group?: string; // Optional group name for organizing properties
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  visible?: boolean; // For conditional visibility
}
