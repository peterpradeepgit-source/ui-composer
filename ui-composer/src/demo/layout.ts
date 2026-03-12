import type { BuilderNode } from "../core/types";

export const layoutDemo: BuilderNode = {
  id: "root",
  type: "Container",
  props: {},
  children: [
    {
      id: "button1",
      type: "Button",
      props: { children: "Button 1" },
      children: [],
    },
    {
      id: "button2",
      type: "Button",
      props: { children: "Hello Hello" },
      children: [],
    },
  ],
};
