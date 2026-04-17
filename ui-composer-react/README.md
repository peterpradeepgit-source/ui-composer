# ui-composer-react

`ui-composer-react` is a React UI builder for composing component trees visually with drag-and-drop, inline property editing, undo/redo history, runtime component registration, and runnable project export.

It is designed for teams that want a ready-made editor shell but still need enough low-level access to control layout data, registered components, and embedding behavior.

## Highlights

- Drag-and-drop canvas for nested component trees
- Built-in property panel for editing component props
- Undo and redo history
- Runtime component registration for custom components
- Starter component library included out of the box
- One-click export to a runnable Vite React project
- TypeScript declarations, ESM, CJS, and packaged CSS

## Install

```bash
npm install ui-composer-react react react-dom
```

`react` and `react-dom` are peer dependencies and must be installed in the consuming app.

## Quick Start

```tsx
import { UIComposer, createEmptyLayout } from "ui-composer-react";
import "ui-composer-react/styles.css";

const initialLayout = createEmptyLayout({
  minHeight: "720px",
  backgroundColor: "#f8fafc",
});

export function App() {
  return <UIComposer initialLayout={initialLayout} />;
}
```

The composer fills the space of its container, so in a real app you should render it inside a wrapper with a defined height.

```tsx
export function Screen() {
  return (
    <div style={{ height: "100vh" }}>
      <UIComposer />
    </div>
  );
}
```

## Included By Default

The package auto-registers a starter component set when you use `UIComposer`.

- `Container`
- `Text`
- `Button`
- `Box`
- `Card`
- `Input`
- `Select`
- `Dropdown`
- `TextArea`
- `Checkbox`
- `Radio`
- `Switch`
- `Toggle`
- `Dialog`
- `Tooltip`
- `Table`
- `DataTable`
- `Accordion`
- `Form`
- `Menu`
- `List`
- `Tab`
- `Toolbar`

If you want full control over registration, you can disable the automatic behavior with `autoRegisterDefaults={false}` and register components yourself.

## `UIComposer` Props

```tsx
type UIComposerProps = {
  initialLayout?: BuilderNode;
  autoRegisterDefaults?: boolean;
  restoreRuntimeRegistrations?: boolean;
  initialPaletteOpen?: boolean;
  initialPropertiesOpen?: boolean;
  className?: string;
  style?: CSSProperties;
};
```

- `initialLayout`: initial tree shown in the canvas
- `autoRegisterDefaults`: registers the built-in component library on mount
- `restoreRuntimeRegistrations`: restores previously saved runtime registrations from local storage
- `initialPaletteOpen`: controls the initial open state of the left panel
- `initialPropertiesOpen`: controls the initial open state of the right panel
- `className` and `style`: let you control the outer composer container

## Creating A Layout

Use `createEmptyLayout` to create a root container quickly:

```tsx
import { createEmptyLayout } from "ui-composer-react";

const layout = createEmptyLayout({
  minHeight: "640px",
  padding: "24px",
  backgroundColor: "#ffffff",
});
```

You can also build the tree yourself:

```ts
const layout = {
  id: "root",
  type: "Container",
  props: {
    minHeight: "640px",
    display: "flex",
    gap: "12px",
  },
  children: [],
};
```

## Registering Custom Components

You can register custom React components at runtime:

```tsx
import { registerExternalComponents } from "ui-composer-react";

await registerExternalComponents({
  modulePath: "/src/components/custom.tsx",
  namespace: "custom",
  defaultProps: {
    title: "Hello",
    tone: "info",
  },
});
```

For more manual control, you can use `registerComponent` directly.

## Exporting Your Design

When your design is ready, use the `Export` button in the top toolbar. It opens an export panel with three paths.

Use `Export TSX` for the fastest, most compact TypeScript export. It downloads a single component file, such as `GeneratedDesign.tsx`, with the imports and JSX needed to render the current canvas design in any React project.

Use `Export JSX` when you want the same compact single-file export for a JavaScript React project. It downloads `GeneratedDesign.jsx`.

Use `Runnable app` when you want a complete starter project. The browser will ask you to choose or create a folder, then `ui-composer-react` writes a Vite React project into that folder.

The full project export includes:

- `package.json`
- `index.html`
- `tsconfig.json`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles.css`
- `README.md`

Run the exported project with:

```bash
npm install
npm run dev
```

Directory export uses the browser File System Access API, so it works best in Chromium-based browsers such as Chrome and Edge. If the design uses runtime-registered external components, make sure those component import paths are available inside the exported project.

## Saving And Loading Designs

Use `Save JSON` to download the current builder tree as a portable design file. Use `Load JSON` to bring that design back into the editor later.

Export and save actions are disabled until the canvas contains at least one component. This avoids accidental empty exports.

## Public API

The main exports are:

- `UIComposer`
- `createEmptyLayout`
- `registerDefaults`
- `ensureDefaultComponentsRegistered`
- `registerComponent`
- `registerExternalComponents`
- `getRegisteredComponents`
- `getComponentMeta`
- `generateComponentFile`
- `generateProjectFiles`
- `serializeDesign`
- `parseDesignJson`
- `BuilderProvider`
- `Canvas`
- `ComponentPalette`
- `BuilderToolbar`
- `HistoryShortcuts`
- `useBuilder`

The package also exports the built-in components, layout/history helpers, and related types.

## Styling

Import the packaged stylesheet once in your app:

```tsx
import "ui-composer-react/styles.css";
```

The distributed stylesheet covers the editor shell and built-in components. If you want app-level resets or page-level styles, keep those in your own application rather than relying on the package.

## Package Output

The published package includes:

- ESM build
- CommonJS build
- TypeScript declaration files
- packaged CSS at `ui-composer-react/styles.css`

## Local Development

```bash
npm run dev
npm test
npm run lint
npm run build
```

## License

MIT
