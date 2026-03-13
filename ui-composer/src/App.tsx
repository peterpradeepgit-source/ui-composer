import { BuilderProvider } from "./builder/BuilderContext";
import { RenderNode } from "./builder/RenderNode";
import { registerDefaults } from "./core/registerDefaults";
import { layoutDemo } from "./demo/layout";

registerDefaults();
export default function App() {
  return (
    <BuilderProvider initialLayout={layoutDemo}>
      <RenderNode node={layoutDemo} />
    </BuilderProvider>
  );
}
