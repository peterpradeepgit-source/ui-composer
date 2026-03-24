import { BuilderProvider } from "./builder/BuilderContext";
import { Canvas } from "./builder/Canvas";
import { ComponentPalette } from "./builder/ComponentPalette";
import { registerDefaults } from "./core/registerDefaults";
import { layoutDemo } from "./demo/layout";
import { PropertyPanel } from "./editor/propertyPanel";

registerDefaults();
export default function App() {
  return (
    <BuilderProvider initialLayout={layoutDemo}>
      <div className="layout">
        <ComponentPalette />
        <Canvas />
        <PropertyPanel />
      </div>
    </BuilderProvider>
  );
}
