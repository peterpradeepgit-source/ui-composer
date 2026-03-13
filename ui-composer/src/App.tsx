import { BuilderProvider } from "./builder/BuilderContext";
import { Canvas } from "./builder/Canvas";
import { ComponentPalette } from "./builder/ComponentPalette";
import { registerDefaults } from "./core/registerDefaults";
import { layoutDemo } from "./demo/layout";

registerDefaults();
export default function App() {
  return (
    <BuilderProvider initialLayout={layoutDemo}>
      <div style={{ display: "flex", height: "100vh" }}>
        <ComponentPalette />
        <Canvas />
      </div>
    </BuilderProvider>
  );
}
