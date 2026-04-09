import { useState } from "react";
import { BuilderProvider } from "./builder/BuilderContext";
import { Canvas } from "./builder/Canvas";
import { ComponentPalette } from "./builder/ComponentPalette";
import { RuntimeRegistrationBootstrap } from "./builder/RuntimeRegistrationBootstrap";
import { BuilderToolbar } from "./builder/BuilderToolbar";
import { HistoryShortcuts } from "./builder/HistoryShortcuts";
import { registerDefaults } from "./core/registerDefaults";
import { layoutDemo } from "./demo/layout";
import { PropertyPanel } from "./editor/propertyPanel";

registerDefaults();
export default function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);

  return (
    <BuilderProvider initialLayout={layoutDemo}>
      <RuntimeRegistrationBootstrap />
      <HistoryShortcuts />
      <div className="layout">
        <ComponentPalette
          isOpen={isPaletteOpen}
          onToggle={() => setIsPaletteOpen((current) => !current)}
        />
        <div className="canvas-shell">
          <BuilderToolbar
            isPropertiesOpen={isPropertiesOpen}
            onToggleProperties={() => setIsPropertiesOpen((current) => !current)}
          />
          <Canvas />
        </div>
        <PropertyPanel
          isOpen={isPropertiesOpen}
          onToggle={() => setIsPropertiesOpen((current) => !current)}
        />
      </div>
    </BuilderProvider>
  );
}
