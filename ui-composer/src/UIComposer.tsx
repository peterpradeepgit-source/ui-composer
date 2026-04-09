import { useState } from "react";
import type { CSSProperties } from "react";
import { BuilderProvider } from "./builder/BuilderContext";
import { BuilderToolbar } from "./builder/BuilderToolbar";
import { Canvas } from "./builder/Canvas";
import { ComponentPalette } from "./builder/ComponentPalette";
import { HistoryShortcuts } from "./builder/HistoryShortcuts";
import { RuntimeRegistrationBootstrap } from "./builder/RuntimeRegistrationBootstrap";
import { ensureDefaultComponentsRegistered } from "./core/registerDefaults";
import type { BuilderNode } from "./core/types";
import { createEmptyLayout } from "./createEmptyLayout";
import { PropertyPanel } from "./editor/propertyPanel";

export type UIComposerProps = {
  initialLayout?: BuilderNode;
  autoRegisterDefaults?: boolean;
  restoreRuntimeRegistrations?: boolean;
  initialPaletteOpen?: boolean;
  initialPropertiesOpen?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function UIComposer({
  initialLayout = createEmptyLayout(),
  autoRegisterDefaults = true,
  restoreRuntimeRegistrations = true,
  initialPaletteOpen = true,
  initialPropertiesOpen = true,
  className,
  style,
}: UIComposerProps) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(initialPaletteOpen);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(initialPropertiesOpen);

  if (autoRegisterDefaults) {
    ensureDefaultComponentsRegistered();
  }

  return (
    <BuilderProvider initialLayout={initialLayout}>
      {restoreRuntimeRegistrations ? <RuntimeRegistrationBootstrap /> : null}
      <HistoryShortcuts />
      <div className={className ? `layout ${className}` : "layout"} style={style}>
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
