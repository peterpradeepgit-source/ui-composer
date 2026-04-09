import React from "react";
import type { PropertyScehema } from "../editor/propertyTypes";
import type { NodeProps } from "./types";

export type ComponentMeta = {
  type: string;
  label: string;
  defaultProps?: NodeProps;
  allowedChildren?: string[];
  icon?: React.ReactNode;
  properties?: PropertyScehema[];
  canHaveChildren?: boolean;
};

export const commonLayoutProperties: PropertyScehema[] = [
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

export const textSpecificProperties: PropertyScehema[] = [
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

const childrenProperty: PropertyScehema = {
  name: "children",
  label: "Children",
  type: "text",
};

const labelProperty: PropertyScehema = {
  name: "label",
  label: "Label",
  type: "text",
};

const placeholderProperty: PropertyScehema = {
  name: "placeholder",
  label: "Placeholder",
  type: "text",
};

const valueProperty: PropertyScehema = {
  name: "value",
  label: "Value",
  type: "text",
};

const checkedProperty: PropertyScehema = {
  name: "checked",
  label: "Checked",
  type: "boolean",
};

const itemsProperty: PropertyScehema = {
  name: "items",
  label: "Items",
  type: "json",
};

const optionsProperty: PropertyScehema = {
  name: "options",
  label: "Options",
  type: "json",
};

const htmlPropsProperty = (label: string): PropertyScehema => ({
  name: "htmlProps",
  label,
  type: "json",
});

const tableProperties: PropertyScehema[] = [
  { name: "columns", label: "Columns", type: "json" },
  { name: "rows", label: "Rows", type: "json" },
  ...commonLayoutProperties,
  htmlPropsProperty("Table Props"),
];

const fieldProperties: PropertyScehema[] = [
  valueProperty,
  placeholderProperty,
  ...commonLayoutProperties,
];

export const defaultComponentMeta: ComponentMeta[] = [
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
    canHaveChildren: true,
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
    canHaveChildren: false,
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
    canHaveChildren: false,
  },
  {
    type: "Box",
    label: "Box",
    defaultProps: {
      padding: "16px",
      border: "1px solid #d8dbe2",
      borderRadius: "10px",
      backgroundColor: "#ffffff",
    },
    properties: [...commonLayoutProperties, childrenProperty, htmlPropsProperty("Box Props")],
    canHaveChildren: true,
  },
  {
    type: "Card",
    label: "Card",
    defaultProps: {
      padding: "16px",
      border: "1px solid #dde3ea",
      borderRadius: "14px",
      backgroundColor: "#ffffff",
      children: "Card content",
    },
    properties: [...commonLayoutProperties, childrenProperty, htmlPropsProperty("Card Props")],
    canHaveChildren: true,
  },
  {
    type: "Select",
    label: "Select",
    defaultProps: {
      value: "option-1",
      options: [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
      ],
    },
    properties: [...fieldProperties, optionsProperty, htmlPropsProperty("Select Props")],
    canHaveChildren: false,
  },
  {
    type: "Dropdown",
    label: "Dropdown",
    defaultProps: {
      value: "option-1",
      options: [
        { label: "First", value: "option-1" },
        { label: "Second", value: "option-2" },
      ],
    },
    properties: [...fieldProperties, optionsProperty, htmlPropsProperty("Dropdown Props")],
    canHaveChildren: false,
  },
  {
    type: "TextArea",
    label: "TextArea",
    defaultProps: {
      value: "Type here",
      rows: 4,
      minHeight: "96px",
    },
    properties: [
      valueProperty,
      { name: "rows", label: "Rows", type: "number" },
      ...commonLayoutProperties,
      htmlPropsProperty("Textarea Props"),
    ],
    canHaveChildren: false,
  },
  {
    type: "Radio",
    label: "Radio",
    defaultProps: {
      label: "Radio option",
      checked: false,
    },
    properties: [labelProperty, checkedProperty, ...commonLayoutProperties, htmlPropsProperty("Radio Props")],
    canHaveChildren: false,
  },
  {
    type: "Table",
    label: "Table",
    defaultProps: {
      columns: ["Name", "Role"],
      rows: [
        { Name: "Alex", Role: "Designer" },
        { Name: "Riley", Role: "Engineer" },
      ],
      width: "100%",
    },
    properties: tableProperties,
    canHaveChildren: false,
  },
  {
    type: "DataTable",
    label: "DataTable",
    defaultProps: {
      columns: ["Name", "Status"],
      rows: [
        { Name: "Order 1", Status: "Active" },
        { Name: "Order 2", Status: "Paused" },
      ],
      width: "100%",
      striped: true,
    },
    properties: [...tableProperties, { name: "striped", label: "Striped", type: "boolean" }],
    canHaveChildren: false,
  },
  {
    type: "Accordion",
    label: "Accordion",
    defaultProps: {
      title: "Accordion",
      open: true,
      children: "Accordion content",
      padding: "12px",
      border: "1px solid #d8dbe2",
      borderRadius: "10px",
    },
    properties: [
      { name: "title", label: "Title", type: "text" },
      { name: "open", label: "Open", type: "boolean" },
      childrenProperty,
      ...commonLayoutProperties,
      htmlPropsProperty("Accordion Props"),
    ],
    canHaveChildren: true,
  },
  {
    type: "Checkbox",
    label: "Checkbox",
    defaultProps: {
      label: "Checkbox",
      checked: true,
    },
    properties: [labelProperty, checkedProperty, ...commonLayoutProperties, htmlPropsProperty("Checkbox Props")],
    canHaveChildren: false,
  },
  {
    type: "Dialog",
    label: "Dialog",
    defaultProps: {
      title: "Dialog",
      description: "Dialog description",
      open: true,
      children: "Dialog content",
      padding: "20px",
      width: "320px",
      borderRadius: "18px",
      backgroundColor: "#ffffff",
    },
    properties: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "open", label: "Open", type: "boolean" },
      childrenProperty,
      ...commonLayoutProperties,
      htmlPropsProperty("Dialog Props"),
    ],
    canHaveChildren: true,
  },
  {
    type: "Form",
    label: "Form",
    defaultProps: {
      padding: "16px",
      gap: "10px",
      border: "1px solid #dde3ea",
      borderRadius: "12px",
      display: "flex",
    },
    properties: [...commonLayoutProperties, childrenProperty, htmlPropsProperty("Form Props")],
    canHaveChildren: true,
  },
  {
    type: "Input",
    label: "Input",
    defaultProps: {
      value: "",
      placeholder: "Enter text",
      padding: "10px 12px",
      border: "1px solid #c9d1e1",
      borderRadius: "8px",
      width: "240px",
    },
    properties: [...fieldProperties, htmlPropsProperty("Input Props")],
    canHaveChildren: false,
  },
  {
    type: "Menu",
    label: "Menu",
    defaultProps: {
      items: ["Overview", "Billing", "Settings"],
      padding: "10px",
      border: "1px solid #dde3ea",
      borderRadius: "10px",
      backgroundColor: "#ffffff",
    },
    properties: [itemsProperty, ...commonLayoutProperties, childrenProperty, htmlPropsProperty("Menu Props")],
    canHaveChildren: true,
  },
  {
    type: "List",
    label: "List",
    defaultProps: {
      items: ["First item", "Second item", "Third item"],
      padding: "8px 16px",
    },
    properties: [itemsProperty, ...commonLayoutProperties, childrenProperty, htmlPropsProperty("List Props")],
    canHaveChildren: true,
  },
  {
    type: "Tab",
    label: "Tab",
    defaultProps: {
      label: "Tab",
      pressed: true,
      padding: "10px 14px",
      border: "1px solid #c9d1e1",
      borderRadius: "999px",
    },
    properties: [
      labelProperty,
      { name: "pressed", label: "Active", type: "boolean" },
      ...commonLayoutProperties,
      htmlPropsProperty("Tab Props"),
    ],
    canHaveChildren: false,
  },
  {
    type: "Switch",
    label: "Switch",
    defaultProps: {
      label: "Switch",
      checked: true,
    },
    properties: [labelProperty, checkedProperty, ...commonLayoutProperties, htmlPropsProperty("Switch Props")],
    canHaveChildren: false,
  },
  {
    type: "Toggle",
    label: "Toggle",
    defaultProps: {
      label: "Toggle",
      pressed: false,
      padding: "10px 14px",
      border: "1px solid #c9d1e1",
      borderRadius: "999px",
    },
    properties: [
      labelProperty,
      { name: "pressed", label: "Pressed", type: "boolean" },
      ...commonLayoutProperties,
      htmlPropsProperty("Toggle Props"),
    ],
    canHaveChildren: false,
  },
  {
    type: "Toolbar",
    label: "Toolbar",
    defaultProps: {
      padding: "8px 12px",
      gap: "8px",
      display: "flex",
      border: "1px solid #dde3ea",
      borderRadius: "10px",
    },
    properties: [...commonLayoutProperties, childrenProperty, htmlPropsProperty("Toolbar Props")],
    canHaveChildren: true,
  },
  {
    type: "Tooltip",
    label: "Tooltip",
    defaultProps: {
      title: "Helpful tooltip",
      children: "Hover target",
      gap: "6px",
    },
    properties: [
      { name: "title", label: "Title", type: "text" },
      childrenProperty,
      ...commonLayoutProperties,
      htmlPropsProperty("Tooltip Props"),
    ],
    canHaveChildren: true,
  },
];
