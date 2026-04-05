import React from "react";
import type { PropertyScehema } from "../editor/propertyTypes";
import type { NodeProps } from "./types";

export type ComponentMeta = {
  type: string;
  label: string;
  defaultProps?: NodeProps;
  allowedChildren?: string[]; // List of allowed child component types
  icon?: React.ReactNode; // Optional icon for the component
  properties?: PropertyScehema[]; // List of properties for the component

};

const commonLayoutProperties: PropertyScehema[] = [
  { name: "width", label: "Width", type: "text" },
  { name: "height", label: "Height", type: "text" },
  { name: "minWidth", label: "Min Width", type: "text" },
  { name: "minHeight", label: "Min Height", type: "text" },
  { name: "maxWidth", label: "Max Width", type: "text" },
  { name: "maxHeight", label: "Max Height", type: "text" },
  { name: "padding", label: "Padding", type: "text" },
  { name: "margin", label: "Margin", type: "text" },
  { name: "border", label: "Border", type: "text" },
  { name: "borderRadius", label: "Border Radius", type: "text" },
  { name: "background", label: "Background", type: "text" },
  { name: "backgroundColor", label: "Background Color", type: "color" },
  { name: "color", label: "Text Color", type: "color" },
  {
    name: "textAlign",
    label: "Text Align",
    type: "select",
    options: ["left", "center", "right", "justify"],
  },
  {
    name: "display",
    label: "Display",
    type: "select",
    options: ["block", "inline-block", "flex", "inline-flex"],
  },
  {
    name: "justifyContent",
    label: "Justify Content",
    type: "select",
    options: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
  },
  {
    name: "alignItems",
    label: "Align Items",
    type: "select",
    options: ["stretch", "flex-start", "center", "flex-end", "baseline"],
  },
  {
    name: "alignSelf",
    label: "Align Self",
    type: "select",
    options: ["auto", "stretch", "flex-start", "center", "flex-end", "baseline"],
  },
  { name: "gap", label: "Gap", type: "text" },
  { name: "fontSize", label: "Font Size", type: "text" },
  { name: "fontWeight", label: "Font Weight", type: "text" },
  { name: "lineHeight", label: "Line Height", type: "text" },
];

const textSpecificProperties: PropertyScehema[] = [
  { name: "fontFamily", label: "Font Family", type: "text" },
  { name: "letterSpacing", label: "Letter Spacing", type: "text" },
  {
    name: "textTransform",
    label: "Text Transform",
    type: "select",
    options: ["none", "uppercase", "lowercase", "capitalize"],
  },
  {
    name: "fontStyle",
    label: "Font Style",
    type: "select",
    options: ["normal", "italic", "oblique"],
  },
  { name: "textDecoration", label: "Text Decoration", type: "text" },
  {
    name: "whiteSpace",
    label: "White Space",
    type: "select",
    options: ["normal", "nowrap", "pre-wrap", "pre-line"],
  },
];

export const componentMeta: ComponentMeta[] = [
  {
    type: "Container",
    label: "Container",
    defaultProps: {
      width: "320px",
      minHeight: "84px",
      direction: "column",
      padding: "20px",
      border: "1px dashed #ccc",
      borderRadius: "4px",
      backgroundColor: "#f9f9f9",
      gap: "10px",
      display: "flex",
    },
    properties: [
      ...commonLayoutProperties,
      {
        name: "direction",
        label: "Direction",
        type: "select",
        options: ["column", "row"],
      },
      {
        name: "htmlProps",
        label: "Div Props",
        type: "json",
      },
    ],
  },
  {
    type: "Button",
    label: "Button",
    defaultProps: {
      children: "Button",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
    },
    properties: [
      {
        name: "children",
        label: "Text",
        type: "text",
      },
      ...commonLayoutProperties,
      {
        name: "htmlProps",
        label: "Button Props",
        type: "json",
      },
    ],
  },
  {
    type: "Text",
    label: "Text",
    defaultProps: {
      text: "change text here",
      padding: "10px",
      border: "1px dashed #aaa",
      borderRadius: "4px",
      backgroundColor: "#fefefe",
    },
    properties: [
      {
        name: "text",
        label: "Text",
        type: "text",
      },
      ...commonLayoutProperties,
      ...textSpecificProperties,
      {
        name: "htmlProps",
        label: "Text Props",
        type: "json",
      },
    ],
  },
];
