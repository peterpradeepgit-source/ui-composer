import type { BuilderNode, NodePropValue } from "../core/types.ts";

export type DesignJsonFile = {
  path: string;
  contents: string;
};

type FileInputWindow = Window & typeof globalThis;

function isNodePropValue(value: unknown): value is NodePropValue {
  if (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isNodePropValue(item));
  }

  if (typeof value === "object") {
    return Object.values(value).every((item) => isNodePropValue(item));
  }

  return false;
}

export function isBuilderNode(value: unknown): value is BuilderNode {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<BuilderNode>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.props === "object" &&
    candidate.props !== null &&
    isNodePropValue(candidate.props) &&
    Array.isArray(candidate.children) &&
    candidate.children.every((child) => isBuilderNode(child))
  );
}

export function serializeDesign(design: BuilderNode) {
  return `${JSON.stringify(design, null, 2)}\n`;
}

export function parseDesignJson(contents: string): BuilderNode {
  const parsed = JSON.parse(contents) as unknown;

  if (!isBuilderNode(parsed)) {
    throw new Error("The selected file is not a valid ui-composer-react design JSON file.");
  }

  return parsed;
}

export function createDesignJsonFile(
  design: BuilderNode,
  fileName = "ui-composer-design",
): DesignJsonFile {
  const safeFileName =
    fileName
      .trim()
      .replace(/\.json$/i, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "ui-composer-design";

  return {
    path: `${safeFileName}.json`,
    contents: serializeDesign(design),
  };
}

export function downloadDesignJson(design: BuilderNode, fileName?: string) {
  if (typeof document === "undefined") {
    throw new Error("Design JSON download requires a browser environment.");
  }

  const file = createDesignJsonFile(design, fileName);
  const blob = new Blob([file.contents], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.path;
  link.click();
  URL.revokeObjectURL(url);

  return file;
}

export function readDesignJsonFromUserFile() {
  if (typeof document === "undefined") {
    throw new Error("Design JSON import requires a browser environment.");
  }

  return new Promise<BuilderNode>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";

    input.addEventListener(
      "change",
      () => {
        const file = input.files?.[0];

        if (!file) {
          reject(new DOMException("No file selected", "AbortError"));
          return;
        }

        void file
          .text()
          .then((contents) => resolve(parseDesignJson(contents)))
          .catch((error: unknown) => reject(error));
      },
      { once: true },
    );

    const browserWindow = window as FileInputWindow;
    browserWindow.setTimeout(() => input.click(), 0);
  });
}
