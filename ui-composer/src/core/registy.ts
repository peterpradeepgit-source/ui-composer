import { useSyncExternalStore } from "react";
import { defaultComponentMeta } from "./componentMeta.ts";
import type { PropertyScehema } from "../editor/propertyTypes.ts";
import type { ComponentMeta } from "./componentMeta.ts";
import type { NodeProps, NodePropValue } from "./types.ts";

export type ComponentConfig<TProps extends object = Record<string, unknown>> = {
  component: React.ComponentType<TProps>;
  importPath: string;
  exportName?: string;
};

export type RegisteredComponent<TProps extends object = Record<string, unknown>> =
  ComponentConfig<TProps> &
    ComponentMeta & {
      source?: "default" | "external";
    };

const registry: Record<string, RegisteredComponent> = {};
const listeners = new Set<() => void>();
let registrySnapshot: RegisteredComponent[] = [];

export function resetComponentRegistry() {
  for (const key of Object.keys(registry)) {
    delete registry[key];
  }

  registrySnapshot = [];
  listeners.forEach((listener) => listener());
}

export function registerComponent<TProps extends object>(
  name: string,
  config: RegisteredComponent<TProps>,
) {
  registry[name] = { ...config, type: name } as RegisteredComponent;
  registrySnapshot = Object.values(registry);
  listeners.forEach((listener) => listener());
}

export function getComponentConfig(name: string): ComponentConfig | undefined {
  return registry[name];
}

export function getComponentMeta(name: string): ComponentMeta | undefined {
  return registry[name] ?? defaultComponentMeta.find((component) => component.type === name);
}

export function getRegisteredComponents(): RegisteredComponent[] {
  return registrySnapshot;
}

export function canComponentHaveChildren(name: string): boolean {
  return Boolean(getComponentMeta(name)?.canHaveChildren);
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useRegisteredComponents() {
  return useSyncExternalStore(subscribe, getRegisteredComponents, getRegisteredComponents);
}

type RegisterExternalComponentsInput = {
  modulePath: string;
  importPath?: string;
  exportNames?: string[];
  namespace?: string;
  canHaveChildren?: boolean;
  defaultProps?: NodeProps;
  properties?: PropertyScehema[];
};

export type RuntimeRegistrationConfig = RegisterExternalComponentsInput & {
  persistKey?: string;
};

type RegisterExternalComponentsResult = {
  registered: string[];
  skipped: string[];
  entries: Array<{
    typeName: string;
    label: string;
    exportName: string;
    importPath: string;
    modulePath: string;
  }>;
};

function isNodePropValue(value: unknown): value is NodePropValue {
  if (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isNodePropValue(item));
  }

  if (typeof value === "object") {
    return Object.values(value).every((item) => isNodePropValue(item));
  }

  return false;
}

function createSchemaFromDefaultProps(defaultProps: NodeProps): PropertyScehema[] {
  return Object.entries(defaultProps)
    .filter(([, value]) => isNodePropValue(value))
    .map(([name, value]) => ({
      name,
      label: name,
      type:
        typeof value === "boolean"
          ? "boolean"
          : typeof value === "number"
            ? "number"
            : typeof value === "object"
              ? "json"
              : "text",
    }));
}

function isReactComponentCandidate(value: unknown): value is React.ComponentType<Record<string, unknown>> {
  return typeof value === "function" || (typeof value === "object" && value !== null);
}

function createRegisteredTypeName(namespace: string | undefined, exportName: string) {
  return namespace ? `${namespace}/${exportName}` : exportName;
}

function getModuleBaseName(modulePath: string) {
  const normalizedPath = modulePath.replace(/\/+$/, "");
  const lastSegment = normalizedPath.split("/").filter(Boolean).pop() ?? "Component";
  const withoutExtension = lastSegment.replace(/\.[^.]+$/, "");

  if (withoutExtension === "index") {
    const parentSegment = normalizedPath.split("/").filter(Boolean).slice(-2, -1)[0];
    return parentSegment ?? "Component";
  }

  return withoutExtension;
}

function getExportRegistrationName(modulePath: string, exportName: string) {
  if (exportName === "default") {
    return getModuleBaseName(modulePath);
  }

  return exportName;
}

export async function registerExternalComponents({
  modulePath,
  importPath,
  exportNames,
  namespace,
  canHaveChildren = false,
  defaultProps = {},
  properties,
}: RegisterExternalComponentsInput): Promise<RegisterExternalComponentsResult> {
  const loadedModule = (await import(/* @vite-ignore */ modulePath)) as Record<string, unknown>;
  const requestedExports =
    exportNames && exportNames.length > 0
      ? exportNames
      : Object.keys(loadedModule);
  const registered: string[] = [];
  const skipped: string[] = [];
  const entries: RegisterExternalComponentsResult["entries"] = [];
  const inferredProperties =
    properties && properties.length > 0
      ? properties
      : createSchemaFromDefaultProps(defaultProps);

  for (const exportName of requestedExports) {
    const moduleExport = loadedModule[exportName];

    if (!isReactComponentCandidate(moduleExport)) {
      skipped.push(exportName);
      continue;
    }

    const registrationName = getExportRegistrationName(modulePath, exportName);
    const typeName = createRegisteredTypeName(namespace, registrationName);

    registerComponent(typeName, {
      type: typeName,
      label: registrationName,
      component: moduleExport,
      importPath: importPath ?? modulePath,
      exportName,
      defaultProps,
      properties: inferredProperties,
      canHaveChildren,
      source: "external",
    });
    registered.push(typeName);
    entries.push({
      typeName,
      label: registrationName,
      exportName,
      importPath: importPath ?? modulePath,
      modulePath,
    });
  }

  return { registered, skipped, entries };
}

export const runtimeRegistrationStorageKey = "ui-composer:runtime-registrations";

export function readRuntimeRegistrationConfigs(): RuntimeRegistrationConfig[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(runtimeRegistrationStorageKey);
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return Array.isArray(parsed) ? (parsed as RuntimeRegistrationConfig[]) : [];
  } catch {
    return [];
  }
}

export function saveRuntimeRegistrationConfig(config: RuntimeRegistrationConfig) {
  if (typeof window === "undefined") {
    return;
  }

  const existingConfigs = readRuntimeRegistrationConfigs();
  const configKey =
    config.persistKey ??
    [
      config.modulePath,
      config.namespace ?? "",
      ...(config.exportNames ?? []),
    ].join("|");

  const nextConfigs = [
    ...existingConfigs.filter((entry) => {
      const entryKey =
        entry.persistKey ??
        [
          entry.modulePath,
          entry.namespace ?? "",
          ...(entry.exportNames ?? []),
        ].join("|");
      return entryKey !== configKey;
    }),
    { ...config, persistKey: configKey },
  ];

  window.localStorage.setItem(runtimeRegistrationStorageKey, JSON.stringify(nextConfigs));
}
