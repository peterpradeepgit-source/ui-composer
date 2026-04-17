import assert from "node:assert/strict";
import test from "node:test";
import { registerComponent, resetComponentRegistry } from "../core/registy.ts";
import type { BuilderNode } from "../core/types.ts";
import { generateComponentFile, generateProjectFiles } from "./exportProject.ts";

function TestComponent() {
  return null;
}

test("generateProjectFiles creates a runnable React project structure", () => {
  resetComponentRegistry();
  registerComponent("Container", {
    type: "Container",
    label: "Container",
    component: TestComponent,
    importPath: "@/components/Container",
    canHaveChildren: true,
    source: "default",
  });
  registerComponent("Button", {
    type: "Button",
    label: "Button",
    component: TestComponent,
    importPath: "@/components/Button",
    canHaveChildren: false,
    source: "default",
  });

  const design: BuilderNode = {
    id: "root",
    type: "Container",
    props: {
      width: "100%",
      padding: "24px",
    },
    children: [
      {
        id: "button-1",
        type: "Button",
        props: {
          children: "Launch",
          backgroundColor: "#2563eb",
          color: "#ffffff",
        },
        children: [],
      },
    ],
  };

  const files = generateProjectFiles(design, {
    projectName: "Marketing Page",
  });
  const filePaths = files.map((file) => file.path);
  const appFile = files.find((file) => file.path === "src/App.tsx");
  const packageFile = files.find((file) => file.path === "package.json");

  assert.deepEqual(filePaths, [
    "package.json",
    "index.html",
    "tsconfig.json",
    "src/main.tsx",
    "src/App.tsx",
    "src/styles.css",
    "README.md",
  ]);
  assert.ok(appFile?.contents.includes('import { Button, Container } from "ui-composer-react";'));
  assert.ok(appFile?.contents.includes("backgroundColor=\"#2563eb\""));
  assert.ok(appFile?.contents.includes("Launch"));
  assert.ok(packageFile?.contents.includes('"name": "marketing-page"'));
  assert.ok(packageFile?.contents.includes('"ui-composer-react": "^1.0.0"'));
});

test("generateComponentFile creates a compact reusable TSX component", () => {
  resetComponentRegistry();
  registerComponent("Button", {
    type: "Button",
    label: "Button",
    component: TestComponent,
    importPath: "@/components/Button",
    canHaveChildren: false,
    source: "default",
  });

  const design: BuilderNode = {
    id: "button-1",
    type: "Button",
    props: {
      children: "Download me",
      padding: "12px 18px",
    },
    children: [],
  };

  const file = generateComponentFile(design, {
    componentName: "HeroCta",
  });

  assert.equal(file.path, "HeroCta.tsx");
  assert.ok(file.contents.includes('import { Button } from "ui-composer-react";'));
  assert.ok(file.contents.includes('import "ui-composer-react/styles.css";'));
  assert.ok(file.contents.includes("export function HeroCta()"));
  assert.ok(file.contents.includes("Download me"));
});

test("generateComponentFile can create JSX without a styles import", () => {
  resetComponentRegistry();
  registerComponent("Button", {
    type: "Button",
    label: "Button",
    component: TestComponent,
    importPath: "@/components/Button",
    canHaveChildren: false,
    source: "default",
  });

  const file = generateComponentFile(
    {
      id: "button-1",
      type: "Button",
      props: {
        children: "Plain JSX",
      },
      children: [],
    },
    {
      componentName: "PlainExport",
      fileFormat: "jsx",
      includeStylesImport: false,
    },
  );

  assert.equal(file.path, "PlainExport.jsx");
  assert.ok(file.contents.includes('import { Button } from "ui-composer-react";'));
  assert.equal(file.contents.includes('import "ui-composer-react/styles.css";'), false);
  assert.ok(file.contents.includes("export function PlainExport()"));
});

test("generateComponentFile preserves external named and default imports", () => {
  resetComponentRegistry();
  registerComponent("marketing/Hero", {
    type: "marketing/Hero",
    label: "Hero",
    component: TestComponent,
    importPath: "@/marketing/Hero",
    exportName: "Hero",
    canHaveChildren: true,
    source: "external",
  });
  registerComponent("marketing/Banner", {
    type: "marketing/Banner",
    label: "Banner",
    component: TestComponent,
    importPath: "@/marketing/Banner",
    exportName: "default",
    canHaveChildren: false,
    source: "external",
  });

  const file = generateComponentFile({
    id: "hero-1",
    type: "marketing/Hero",
    props: {},
    children: [
      {
        id: "banner-1",
        type: "marketing/Banner",
        props: {
          children: "Sale",
        },
        children: [],
      },
    ],
  });

  assert.ok(file.contents.includes('import Banner from "@/marketing/Banner";'));
  assert.ok(file.contents.includes('import { Hero } from "@/marketing/Hero";'));
  assert.ok(file.contents.includes("<Banner>"));
  assert.ok(file.contents.includes("Sale"));
});

test("generateComponentFile sanitizes component names, filenames, and prop output", () => {
  resetComponentRegistry();
  registerComponent("Button", {
    type: "Button",
    label: "Button",
    component: TestComponent,
    importPath: "@/components/Button",
    canHaveChildren: false,
    source: "default",
  });

  const file = generateComponentFile(
    {
      id: "button-1",
      type: "Button",
      props: {
        children: "{safe}",
        "aria-label": "Ignored invalid JSX identifier",
        htmlProps: {
          className: "cta",
          disabled: true,
        },
        disabled: false,
      },
      children: [],
    },
    {
      componentName: "123 default",
      fileName: "My Export.tsx",
    },
  );

  assert.equal(file.path, "My-Export.tsx");
  assert.ok(file.contents.includes("export function Default()"));
  assert.equal(file.contents.includes("aria-label"), false);
  assert.ok(file.contents.includes('htmlProps={{"className":"cta","disabled":true}}'));
  assert.ok(file.contents.includes("disabled={false}"));
  assert.ok(file.contents.includes("&#123;safe&#125;"));
});
