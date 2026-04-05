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

export const componentMeta: ComponentMeta[] = [
  {
    type: "Container",
    label: "Container",
  },
  {
    type: "Button",
    label: "Button",
    defaultProps: {
      children: "Button",
    },
    properties: [
      {
        name: "children",
        label: "Text",
        type: "text",
      },
    ],
  },
  {
    type: "Text",
    label: "Text",
    defaultProps: {
      text: "change text here",
    },
    properties: [
      {
        name: "text",
        label: "Text",
        type: "text",
      },
    ],
  },
];
