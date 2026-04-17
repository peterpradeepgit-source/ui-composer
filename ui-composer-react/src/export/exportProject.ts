import {
  getRegisteredComponents,
  type RegisteredComponent,
} from "../core/registy.ts";
import type { BuilderNode, NodePropValue, NodeProps } from "../core/types.ts";

export type GeneratedProjectFile = {
  path: string;
  contents: string;
};

export type GenerateProjectOptions = {
  projectName?: string;
  packageName?: string;
  packageVersion?: string;
  registeredComponents?: RegisteredComponent[];
};

export type GenerateComponentFileOptions = GenerateProjectOptions & {
  componentName?: string;
  fileName?: string;
  fileFormat?: "tsx" | "jsx";
  includeStylesImport?: boolean;
};

type ComponentImport = {
  source: string;
  importedName: string;
  localName: string;
  isDefault: boolean;
};

type FileSystemWritable = {
  write: (contents: string) => Promise<void>;
  close: () => Promise<void>;
};

type FileSystemFileHandleLike = {
  createWritable: () => Promise<FileSystemWritable>;
};

type FileSystemDirectoryHandleLike = {
  getDirectoryHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<FileSystemDirectoryHandleLike>;
  getFileHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<FileSystemFileHandleLike>;
};

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: () => Promise<FileSystemDirectoryHandleLike>;
};

const defaultPackageName = "ui-composer-react";
const defaultPackageVersion = "^1.0.0";
const reservedWords = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);

function toPascalCase(value: string) {
  const candidate = value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");

  return candidate || "GeneratedComponent";
}

function toValidIdentifier(value: string) {
  const candidate = toPascalCase(value).replace(/^[^a-zA-Z_$]+/, "");
  const safeCandidate = candidate || "GeneratedComponent";
  return reservedWords.has(safeCandidate) ? `${safeCandidate}Component` : safeCandidate;
}

function toPackageProjectName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "exported-ui-composer-design";
}

function toFileName(value: string) {
  return value
    .trim()
    .replace(/\.(jsx|tsx)$/i, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "GeneratedDesign";
}

function escapeText(value: string) {
  return value.replaceAll("{", "&#123;").replaceAll("}", "&#125;");
}

function formatPropValue(value: NodePropValue) {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return `{${JSON.stringify(value)}}`;
}

function formatProps(props: NodeProps, depth: number) {
  return Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => {
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
        return null;
      }

      return `${"  ".repeat(depth)}${name}=${formatPropValue(value)}`;
    })
    .filter((line): line is string => Boolean(line));
}

function getComponentExportName(component: RegisteredComponent) {
  if (component.exportName && component.exportName !== "default") {
    return component.exportName;
  }

  return component.type.split("/").filter(Boolean).pop() ?? component.type;
}

function collectNodeTypes(node: BuilderNode, output = new Set<string>()) {
  output.add(node.type);

  for (const child of node.children) {
    collectNodeTypes(child, output);
  }

  return output;
}

function createComponentImports(
  root: BuilderNode,
  registeredComponents: RegisteredComponent[],
  packageName: string,
) {
  const registeredByType = new Map(
    registeredComponents.map((component) => [component.type, component]),
  );
  const usedTypes = [...collectNodeTypes(root)];
  const importsByType = new Map<string, ComponentImport>();
  const usedLocalNames = new Set<string>();

  for (const type of usedTypes) {
    const component = registeredByType.get(type);
    const importedName = component ? getComponentExportName(component) : "div";
    let localName = toValidIdentifier(importedName);

    while (usedLocalNames.has(localName)) {
      localName = `${localName}Component`;
    }

    usedLocalNames.add(localName);

    if (!component) {
      importsByType.set(type, {
        source: "",
        importedName: "div",
        localName: "div",
        isDefault: false,
      });
      continue;
    }

    const isDefaultComponent =
      component.source === "default" || component.importPath.startsWith("@/components/");

    importsByType.set(type, {
      source: isDefaultComponent ? packageName : component.importPath,
      importedName,
      localName,
      isDefault: !isDefaultComponent && component.exportName === "default",
    });
  }

  return importsByType;
}

function renderImportStatements(importsByType: Map<string, ComponentImport>) {
  const namedImportsBySource = new Map<string, Array<{ importedName: string; localName: string }>>();
  const defaultImports: string[] = [];

  for (const componentImport of importsByType.values()) {
    if (!componentImport.source) {
      continue;
    }

    if (componentImport.isDefault) {
      defaultImports.push(
        `import ${componentImport.localName} from ${JSON.stringify(componentImport.source)};`,
      );
      continue;
    }

    const sourceImports = namedImportsBySource.get(componentImport.source) ?? [];
    sourceImports.push({
      importedName: componentImport.importedName,
      localName: componentImport.localName,
    });
    namedImportsBySource.set(componentImport.source, sourceImports);
  }

  const namedImports = [...namedImportsBySource.entries()].map(([source, imports]) => {
    const importSpecifiers = imports
      .sort((first, second) => first.importedName.localeCompare(second.importedName))
      .map(({ importedName, localName }) =>
        importedName === localName ? importedName : `${importedName} as ${localName}`,
      )
      .join(", ");

    return `import { ${importSpecifiers} } from ${JSON.stringify(source)};`;
  });

  return [...defaultImports.sort(), ...namedImports.sort()].join("\n");
}

function renderNode(
  node: BuilderNode,
  importsByType: Map<string, ComponentImport>,
  depth = 2,
  isRoot = false,
): string {
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  const componentImport = importsByType.get(node.type);
  const componentName = componentImport?.localName ?? "div";
  const { children: propChildren, ...restProps } = node.props;
  const props = isRoot ? { ...restProps, isRoot: true } : restProps;
  const propLines = formatProps(props, depth + 1);
  const opening =
    propLines.length > 0
      ? `${indent}<${componentName}\n${propLines.join("\n")}\n${indent}>`
      : `${indent}<${componentName}>`;

  const renderedChildren =
    node.children.length > 0
      ? node.children
          .map((child) => renderNode(child, importsByType, depth + 1))
          .join("\n")
      : typeof propChildren === "string"
        ? `${childIndent}${escapeText(propChildren)}`
        : propChildren !== undefined && propChildren !== null
          ? `${childIndent}{${JSON.stringify(propChildren)}}`
          : "";

  if (!renderedChildren) {
    return propLines.length > 0
      ? `${indent}<${componentName}\n${propLines.join("\n")}\n${indent}/>`
      : `${indent}<${componentName} />`;
  }

  return `${opening}\n${renderedChildren}\n${indent}</${componentName}>`;
}

function createAppSource(
  design: BuilderNode,
  packageName: string,
  registeredComponents: RegisteredComponent[],
) {
  const importsByType = createComponentImports(design, registeredComponents, packageName);
  const componentImports = renderImportStatements(importsByType);
  const renderedDesign = renderNode(design, importsByType, 2, true);

  return `${componentImports}
import "${packageName}/styles.css";
import "./styles.css";

export default function App() {
  return (
    <main className="app-shell">
${renderedDesign}
    </main>
  );
}
`;
}

export function generateComponentFile(
  design: BuilderNode,
  {
    packageName = defaultPackageName,
    registeredComponents = getRegisteredComponents(),
    componentName = "GeneratedDesign",
    fileFormat = "tsx",
    includeStylesImport = true,
    fileName,
  }: GenerateComponentFileOptions = {},
): GeneratedProjectFile {
  const importsByType = createComponentImports(design, registeredComponents, packageName);
  const componentImports = renderImportStatements(importsByType);
  const renderedDesign = renderNode(design, importsByType, 1, true);
  const safeComponentName = toValidIdentifier(componentName);
  const safeFileName = `${toFileName(fileName ?? safeComponentName)}.${fileFormat}`;
  const stylesImport = includeStylesImport ? `\nimport "${packageName}/styles.css";` : "";

  return {
    path: safeFileName,
    contents: `${componentImports}${stylesImport}

export function ${safeComponentName}() {
  return (
${renderedDesign}
  );
}

export default ${safeComponentName};
`,
  };
}

function createPackageJson(projectName: string, packageName: string, packageVersion: string) {
  return `${JSON.stringify(
    {
      name: projectName,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        preview: "vite preview",
      },
      dependencies: {
        [packageName]: packageVersion,
        "@vitejs/plugin-react": "^6.0.0",
        typescript: "~5.9.3",
        vite: "^8.0.0",
        react: "^19.2.4",
        "react-dom": "^19.2.4",
      },
      devDependencies: {
        "@types/react": "^19.2.14",
        "@types/react-dom": "^19.2.3",
      },
    },
    null,
    2,
  )}
`;
}

export function generateProjectFiles(
  design: BuilderNode,
  {
    projectName = "exported-ui-composer-design",
    packageName = defaultPackageName,
    packageVersion = defaultPackageVersion,
    registeredComponents = getRegisteredComponents(),
  }: GenerateProjectOptions = {},
): GeneratedProjectFile[] {
  const safeProjectName = toPackageProjectName(projectName);

  return [
    {
      path: "package.json",
      contents: createPackageJson(safeProjectName, packageName, packageVersion),
    },
    {
      path: "index.html",
      contents: `<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n`,
    },
    {
      path: "tsconfig.json",
      contents: `${JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            useDefineForClassFields: true,
            lib: ["ES2022", "DOM", "DOM.Iterable"],
            allowJs: false,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            module: "ESNext",
            moduleResolution: "Bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
          },
          include: ["src"],
        },
        null,
        2,
      )}
`,
    },
    {
      path: "src/main.tsx",
      contents: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
    },
    {
      path: "src/App.tsx",
      contents: createAppSource(design, packageName, registeredComponents),
    },
    {
      path: "src/styles.css",
      contents: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.app-shell {
  min-height: 100vh;
  padding: 24px;
  background: #f8fafc;
}
`,
    },
    {
      path: "README.md",
      contents: `# ${safeProjectName}

This project was exported from ${packageName}.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

If the exported design uses runtime-registered external components, make sure those component import paths are available inside this project.
`,
    },
  ];
}

async function writeFile(
  rootDirectory: FileSystemDirectoryHandleLike,
  file: GeneratedProjectFile,
) {
  const parts = file.path.split("/");
  const fileName = parts.pop();

  if (!fileName) {
    return;
  }

  let directory = rootDirectory;
  for (const part of parts) {
    directory = await directory.getDirectoryHandle(part, { create: true });
  }

  const fileHandle = await directory.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(file.contents);
  await writable.close();
}

export async function writeProjectToDirectory(
  directory: FileSystemDirectoryHandleLike,
  files: GeneratedProjectFile[],
) {
  for (const file of files) {
    await writeFile(directory, file);
  }
}

export async function exportProjectToDirectory(
  design: BuilderNode,
  options?: GenerateProjectOptions,
) {
  const directoryPicker = (window as DirectoryPickerWindow).showDirectoryPicker;

  if (!directoryPicker) {
    throw new Error(
      "Directory export is not supported in this browser. Use a Chromium-based browser such as Chrome or Edge.",
    );
  }

  const directory = await directoryPicker();
  const files = generateProjectFiles(design, options);
  await writeProjectToDirectory(directory, files);

  return files;
}

export function downloadComponentFile(
  design: BuilderNode,
  options?: GenerateComponentFileOptions,
) {
  if (typeof document === "undefined") {
    throw new Error("Component download requires a browser environment.");
  }

  const file = generateComponentFile(design, options);
  const blob = new Blob([file.contents], {
    type: "text/typescript;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.path;
  link.click();
  URL.revokeObjectURL(url);

  return file;
}
