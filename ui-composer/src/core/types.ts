export type NodePropValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | NodePropValue[]
  | { [key: string]: NodePropValue };

export type NodeProps = Record<string, NodePropValue>;

export type BuilderNode = {
  id: string;
  type: string;
  props: NodeProps;
  children: BuilderNode[];
};
