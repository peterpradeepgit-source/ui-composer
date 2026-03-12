import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { registerComponent } from "./registy";

export function registerDefaults() {
  // Register default components here
  registerComponent("Container", {
    component: Container,
    importPath: "@/components/Container",
  });

  registerComponent("Button", {
    component: Button,
    importPath: "@/components/Button",
  });
}
