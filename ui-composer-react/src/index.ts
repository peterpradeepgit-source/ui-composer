import "./styles/styles.scss";

export { UIComposer } from "./UIComposer";
export type { UIComposerProps } from "./UIComposer";

export { BuilderProvider } from "./builder/BuilderContext";
export { BuilderToolbar } from "./builder/BuilderToolbar";
export { Canvas } from "./builder/Canvas";
export { ComponentPalette } from "./builder/ComponentPalette";
export { HistoryShortcuts } from "./builder/HistoryShortcuts";
export { RuntimeRegistrationBootstrap } from "./builder/RuntimeRegistrationBootstrap";
export { useBuilder } from "./builder/useBuilder";

export { Button } from "./components/Button";
export {
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
} from "./components/CommonLibrary";
export { Container } from "./components/Container";
export { Text } from "./components/Text";

export { ensureDefaultComponentsRegistered, registerDefaults } from "./core/registerDefaults";
export {
  canComponentHaveChildren,
  getComponentConfig,
  getComponentMeta,
  getRegisteredComponents,
  readRuntimeRegistrationConfigs,
  registerComponent,
  registerExternalComponents,
  resetComponentRegistry,
  runtimeRegistrationStorageKey,
  saveRuntimeRegistrationConfig,
  useRegisteredComponents,
} from "./core/registy";
export {
  commonLayoutProperties,
  defaultComponentMeta,
  textSpecificProperties,
} from "./core/componentMeta";
export {
  applyChange,
  createHistory,
  redo,
  undo,
} from "./core/history";
export {
  findNode,
  findParentId,
  insertAfter,
  insertBefore,
  insertNode,
  moveNode,
  removeNode,
  updateNode,
  updateNodeProps,
  updateNodeRecursive,
  replaceNodePropsRecursive,
} from "./core/tree";
export { createEmptyLayout } from "./createEmptyLayout";
export {
  createDesignJsonFile,
  downloadDesignJson,
  isBuilderNode,
  parseDesignJson,
  readDesignJsonFromUserFile,
  serializeDesign,
} from "./export/designJson";
export {
  downloadComponentFile,
  exportProjectToDirectory,
  generateComponentFile,
  generateProjectFiles,
  writeProjectToDirectory,
} from "./export/exportProject";

export type { BuilderContextType } from "./builder/builderContextStore";
export type { ComponentMeta } from "./core/componentMeta";
export type {
  ComponentConfig,
  RegisteredComponent,
  RuntimeRegistrationConfig,
} from "./core/registy";
export type { HistoryState } from "./core/history";
export type { BuilderNode, NodeProps, NodePropValue } from "./core/types";
export type {
  GenerateComponentFileOptions,
  GeneratedProjectFile,
  GenerateProjectOptions,
} from "./export/exportProject";
export type { DesignJsonFile } from "./export/designJson";
export type { PropertyScehema, PropertyType } from "./editor/propertyTypes";
