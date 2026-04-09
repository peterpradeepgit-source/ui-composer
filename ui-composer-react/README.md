# ui-composer-react

`ui-composer` is a React UI builder for composing component trees visually with drag-and-drop, inline property editing, undo/redo history, and runtime component registration.

It is designed for teams that want a ready-made editor shell but still need enough low-level access to control layout data, registered components, and embedding behavior.

## Highlights

- Drag-and-drop canvas for nested component trees
- Built-in property panel for editing component props
- Undo and redo history
- Runtime component registration for custom components
- Starter component library included out of the box
- TypeScript declarations, ESM, CJS, and packaged CSS

## Install

```bash
npm install ui-composer react react-dom
```

`react` and `react-dom` are peer dependencies and must be installed in the consuming app.

## Quick Start

```tsx
import { UIComposer, createEmptyLayout } from "ui-composer";
import "ui-composer/styles.css";

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
import { createEmptyLayout } from "ui-composer";

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
import { registerExternalComponents } from "ui-composer";

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
import "ui-composer/styles.css";
```

The distributed stylesheet covers the editor shell and built-in components. If you want app-level resets or page-level styles, keep those in your own application rather than relying on the package.

## Package Output

The published package includes:

- ESM build
- CommonJS build
- TypeScript declaration files
- packaged CSS at `ui-composer/styles.css`

## Local Development

```bash
npm run dev
npm test
npm run lint
npm run build
```

## License

MIT
