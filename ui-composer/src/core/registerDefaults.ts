import { Container } from "../components/Container.tsx";
import { Button } from "../components/Button.tsx";
import {
  Accordion,
  Box,
  Card,
  Checkbox,
  DataTable,
  Dialog,
  Dropdown,
  Form,
  Input,
  List,
  Menu,
  Radio,
  Select,
  Switch,
  Tab,
  Table,
  TextArea,
  Toggle,
  Toolbar,
  Tooltip,
} from "../components/CommonLibrary.tsx";
import { Text } from "../components/Text.tsx";
import { defaultComponentMeta } from "./componentMeta.ts";
import { registerComponent } from "./registy.ts";

let defaultsRegistered = false;

export function registerDefaults() {
  const metaByType = Object.fromEntries(
    defaultComponentMeta.map((meta) => [meta.type, meta]),
  );

  registerComponent("Container", {
    ...metaByType.Container,
    component: Container,
    importPath: "@/components/Container",
  });

  registerComponent("Button", {
    ...metaByType.Button,
    component: Button,
    importPath: "@/components/Button",
  });

  registerComponent("Text", {
    ...metaByType.Text,
    component: Text,
    importPath: "@/components/Text",
  });

  registerComponent("Box", {
    ...metaByType.Box,
    component: Box,
    importPath: "@/components/CommonLibrary",
    exportName: "Box",
  });

  registerComponent("Card", {
    ...metaByType.Card,
    component: Card,
    importPath: "@/components/CommonLibrary",
    exportName: "Card",
  });

  registerComponent("Select", {
    ...metaByType.Select,
    component: Select,
    importPath: "@/components/CommonLibrary",
    exportName: "Select",
  });

  registerComponent("Dropdown", {
    ...metaByType.Dropdown,
    component: Dropdown,
    importPath: "@/components/CommonLibrary",
    exportName: "Dropdown",
  });

  registerComponent("TextArea", {
    ...metaByType.TextArea,
    component: TextArea,
    importPath: "@/components/CommonLibrary",
    exportName: "TextArea",
  });

  registerComponent("Radio", {
    ...metaByType.Radio,
    component: Radio,
    importPath: "@/components/CommonLibrary",
    exportName: "Radio",
  });

  registerComponent("Table", {
    ...metaByType.Table,
    component: Table,
    importPath: "@/components/CommonLibrary",
    exportName: "Table",
  });

  registerComponent("DataTable", {
    ...metaByType.DataTable,
    component: DataTable,
    importPath: "@/components/CommonLibrary",
    exportName: "DataTable",
  });

  registerComponent("Accordion", {
    ...metaByType.Accordion,
    component: Accordion,
    importPath: "@/components/CommonLibrary",
    exportName: "Accordion",
  });

  registerComponent("Checkbox", {
    ...metaByType.Checkbox,
    component: Checkbox,
    importPath: "@/components/CommonLibrary",
    exportName: "Checkbox",
  });

  registerComponent("Dialog", {
    ...metaByType.Dialog,
    component: Dialog,
    importPath: "@/components/CommonLibrary",
    exportName: "Dialog",
  });

  registerComponent("Form", {
    ...metaByType.Form,
    component: Form,
    importPath: "@/components/CommonLibrary",
    exportName: "Form",
  });

  registerComponent("Input", {
    ...metaByType.Input,
    component: Input,
    importPath: "@/components/CommonLibrary",
    exportName: "Input",
  });

  registerComponent("Menu", {
    ...metaByType.Menu,
    component: Menu,
    importPath: "@/components/CommonLibrary",
    exportName: "Menu",
  });

  registerComponent("List", {
    ...metaByType.List,
    component: List,
    importPath: "@/components/CommonLibrary",
    exportName: "List",
  });

  registerComponent("Tab", {
    ...metaByType.Tab,
    component: Tab,
    importPath: "@/components/CommonLibrary",
    exportName: "Tab",
  });

  registerComponent("Switch", {
    ...metaByType.Switch,
    component: Switch,
    importPath: "@/components/CommonLibrary",
    exportName: "Switch",
  });

  registerComponent("Toggle", {
    ...metaByType.Toggle,
    component: Toggle,
    importPath: "@/components/CommonLibrary",
    exportName: "Toggle",
  });

  registerComponent("Toolbar", {
    ...metaByType.Toolbar,
    component: Toolbar,
    importPath: "@/components/CommonLibrary",
    exportName: "Toolbar",
  });

  registerComponent("Tooltip", {
    ...metaByType.Tooltip,
    component: Tooltip,
    importPath: "@/components/CommonLibrary",
    exportName: "Tooltip",
  });

  defaultsRegistered = true;
}

export function ensureDefaultComponentsRegistered() {
  if (defaultsRegistered) {
    return;
  }

  registerDefaults();
}
