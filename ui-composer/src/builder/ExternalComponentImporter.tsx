import { useMemo, useState } from "react";
import type { PropertyScehema } from "../editor/propertyTypes";
import type { NodeProps } from "../core/types";
import {
  registerExternalComponents,
  saveRuntimeRegistrationConfig,
} from "../core/registy";

function parseJsonObject<T extends object>(value: string, fallback: T): T {
  if (!value.trim()) {
    return fallback;
  }

  const parsed = JSON.parse(value) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Expected a JSON object.");
  }

  return parsed as T;
}

function parseJsonArray<T>(value: string, fallback: T[]): T[] {
  if (!value.trim()) {
    return fallback;
  }

  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Expected a JSON array.");
  }

  return parsed as T[];
}

function escapeSnippetValue(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function ExternalComponentImporter() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modulePath, setModulePath] = useState("");
  const [exportNames, setExportNames] = useState("");
  const [namespace, setNamespace] = useState("");
  const [defaultProps, setDefaultProps] = useState("{\n  \"children\": \"Preview\"\n}");
  const [properties, setProperties] = useState("");
  const [canHaveChildren, setCanHaveChildren] = useState(false);
  const [persistInBrowser, setPersistInBrowser] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [codeSnippet, setCodeSnippet] = useState<string | null>(null);

  const helperText = useMemo(
    () =>
      "Use an installed package like @mui/material or a local module path like ./src/custom/Card.tsx.",
    [],
  );

  async function handleImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsImporting(true);
    setMessage(null);
    setError(null);

    try {
      const parsedDefaultProps = parseJsonObject<NodeProps>(defaultProps, {});
      const parsedProperties = properties.trim()
        ? parseJsonArray<PropertyScehema>(properties, [])
        : undefined;
      const resolvedExportNames = exportNames
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean);
      const result = await registerExternalComponents({
        modulePath: modulePath.trim(),
        importPath: modulePath.trim(),
        exportNames: resolvedExportNames,
        namespace: namespace.trim() || undefined,
        canHaveChildren,
        defaultProps: parsedDefaultProps,
        properties: parsedProperties,
      });

      if (persistInBrowser && result.registered.length > 0) {
        saveRuntimeRegistrationConfig({
          modulePath: modulePath.trim(),
          importPath: modulePath.trim(),
          exportNames: resolvedExportNames,
          namespace: namespace.trim() || undefined,
          canHaveChildren,
          defaultProps: parsedDefaultProps,
          properties: parsedProperties,
        });
      }

      if (result.registered.length === 0) {
        setError(
          result.skipped.length > 0
            ? `No React components were found in: ${result.skipped.join(", ")}`
            : "No components were registered.",
        );
        setCodeSnippet(null);
      } else {
        setMessage(
          `Registered ${result.registered.join(", ")}${result.skipped.length > 0 ? ` • skipped ${result.skipped.join(", ")}` : ""}`,
        );
        setIsExpanded(false);
        setCodeSnippet(`import { registerComponent } from "@/core/registy";
${result.entries
  .map((entry) => {
    const importLine =
      entry.exportName === "default"
        ? `import ${entry.label} from "${entry.importPath}";`
        : `import { ${entry.exportName} as ${entry.label} } from "${entry.importPath}";`;

    return `${importLine}

registerComponent("${entry.typeName}", {
  type: "${entry.typeName}",
  label: "${entry.label}",
  component: ${entry.label},
  importPath: "${entry.importPath}",
  exportName: "${entry.exportName}",
  defaultProps: ${escapeSnippetValue(parsedDefaultProps)},
  properties: ${escapeSnippetValue(parsedProperties ?? [])},
  canHaveChildren: ${String(canHaveChildren)},
  source: "external",
});`;
  })
  .join("\n\n")}`);
      }
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed.");
      setCodeSnippet(null);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <form className="importer-card" onSubmit={handleImport}>
      <button
        type="button"
        className="importer-toggle"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
      >
        <span>Import External Components</span>
        <span
          className={`importer-toggle-icon ${isExpanded ? "importer-toggle-icon-expanded" : ""}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      <p className="importer-help">{helperText}</p>
      {message ? <p className="importer-message">{message}</p> : null}
      {error ? <p className="importer-error">{error}</p> : null}
      {isExpanded ? (
        <>
          <label className="importer-field">
            <span>Module path</span>
            <input
              type="text"
              value={modulePath}
              onChange={(event) => setModulePath(event.target.value)}
              placeholder="@mui/material"
              required
            />
          </label>
          <label className="importer-field">
            <span>Exports</span>
            <input
              type="text"
              value={exportNames}
              onChange={(event) => setExportNames(event.target.value)}
              placeholder="Button, Card"
            />
          </label>
          <label className="importer-field">
            <span>Namespace</span>
            <input
              type="text"
              value={namespace}
              onChange={(event) => setNamespace(event.target.value)}
              placeholder="mui"
            />
          </label>
          <label className="importer-field">
            <span>Default props JSON</span>
            <textarea
              value={defaultProps}
              onChange={(event) => setDefaultProps(event.target.value)}
            />
          </label>
          <label className="importer-field">
            <span>Property schema JSON</span>
            <textarea
              value={properties}
              onChange={(event) => setProperties(event.target.value)}
              placeholder='[{"name":"variant","label":"Variant","type":"text"}]'
            />
          </label>
          <label className="importer-checkbox">
            <input
              type="checkbox"
              checked={canHaveChildren}
              onChange={(event) => setCanHaveChildren(event.target.checked)}
            />
            <span>Allow dropping children inside these components</span>
          </label>
          <label className="importer-checkbox">
            <input
              type="checkbox"
              checked={persistInBrowser}
              onChange={(event) => setPersistInBrowser(event.target.checked)}
            />
            <span>Remember this UI registration in this browser</span>
          </label>
          <button className="toolbar-button importer-button" type="submit" disabled={isImporting}>
            {isImporting ? "Importing..." : "Import Components"}
          </button>
        </>
      ) : null}
      {codeSnippet ? (
        <label className="importer-field">
          <span>Permanent code registration snippet</span>
          <textarea value={codeSnippet} readOnly className="importer-snippet" />
        </label>
      ) : null}
    </form>
  );
}
