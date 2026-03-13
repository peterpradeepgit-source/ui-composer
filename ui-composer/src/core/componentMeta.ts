import React from "react";

export type ComponentMeta = {
  type: string;
  label: string;
  defaultProps?: Record<string, any>;
  allowedChildren?: string[]; // List of allowed child component types
  icon?: React.ReactNode; // Optional icon for the component
};

export const defaultComponentMeta: ComponentMeta[] = [
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
  },
  {
    type: "Text",
    label: "Text",
    defaultProps: {
      children: "Text",
    },
  },
];
