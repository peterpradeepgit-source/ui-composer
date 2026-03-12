export type ComponentConfig = {
  component: React.ComponentType<any>;
  importPath: string;
};

const registry: Record<string, ComponentConfig> = {};

export function registerComponent(name: string, config: ComponentConfig) {
  registry[name] = config;
}

export function getComponentConfig(name: string): ComponentConfig | undefined {
  return registry[name];
}
