export type ComponentConfig<TProps extends object = Record<string, unknown>> = {
  component: React.ComponentType<TProps>;
  importPath: string;
};

const registry: Record<string, ComponentConfig> = {};

export function registerComponent<TProps extends object>(
  name: string,
  config: ComponentConfig<TProps>,
) {
  registry[name] = config as ComponentConfig;
}

export function getComponentConfig(name: string): ComponentConfig | undefined {
  return registry[name];
}
