export type BuilderNode = {
  id: string;
  type: string;
  props: Record<string, any>;
  children: BuilderNode[];
};
