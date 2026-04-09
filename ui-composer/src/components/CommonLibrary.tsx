import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { getCommonStyle, type CommonStyleProps, type SerializableHtmlProps } from "./styleProps";

type Option = {
  label: string;
  value: string;
};

type TableRow = Record<string, string | number | boolean | null>;

type BaseProps = CommonStyleProps & {
  children?: React.ReactNode;
  htmlProps?: SerializableHtmlProps;
};

type SelectLikeProps = CommonStyleProps & {
  value?: string;
  options?: Option[];
  placeholder?: string;
  htmlProps?: Omit<HTMLAttributes<HTMLSelectElement>, "children" | "style"> & {
    style?: CSSProperties;
  };
};

type InputLikeProps = CommonStyleProps & {
  value?: string;
  placeholder?: string;
  htmlProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "style"> & {
    style?: CSSProperties;
  };
};

type TextareaProps = CommonStyleProps & {
  value?: string;
  placeholder?: string;
  rows?: number;
  htmlProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children" | "style"> & {
    style?: CSSProperties;
  };
};

type ChoiceProps = CommonStyleProps & {
  checked?: boolean;
  label?: string;
  name?: string;
  htmlProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "style" | "type"> & {
    style?: CSSProperties;
  };
};

type TableProps = CommonStyleProps & {
  columns?: string[];
  rows?: TableRow[];
  striped?: boolean;
  htmlProps?: SerializableHtmlProps;
};

type AccordionProps = BaseProps & {
  title?: string;
  open?: boolean;
};

type DialogProps = BaseProps & {
  title?: string;
  description?: string;
  open?: boolean;
};

type TooltipProps = BaseProps & {
  title?: string;
};

type ToggleProps = CommonStyleProps & {
  label?: string;
  pressed?: boolean;
  htmlProps?: Omit<HTMLAttributes<HTMLButtonElement>, "children" | "style"> & {
    style?: CSSProperties;
  };
};

type CollectionProps = BaseProps & {
  items?: string[];
};

function withClassName(className: string, extraClassName?: string) {
  return extraClassName ? `${className} ${extraClassName}` : className;
}

function getMergedStyle(
  styleProps: CommonStyleProps,
  inlineStyle?: CSSProperties,
  extraStyle?: CSSProperties,
) {
  return {
    ...inlineStyle,
    ...getCommonStyle(styleProps),
    ...extraStyle,
  };
}

function renderCollectionItems(items?: string[]) {
  return (items && items.length > 0 ? items : ["Item 1", "Item 2", "Item 3"]).map((item) => (
    <li key={item}>{item}</li>
  ));
}

export function Box({ children, htmlProps, ...styleProps }: BaseProps) {
  return (
    <div
      {...htmlProps}
      className={withClassName("box", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      {children || "Box"}
    </div>
  );
}

export function Card({ children, htmlProps, ...styleProps }: BaseProps) {
  return (
    <section
      {...htmlProps}
      className={withClassName("card", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      {children || "Card content"}
    </section>
  );
}

export function Form({ children, htmlProps, ...styleProps }: BaseProps) {
  return (
    <form
      {...htmlProps}
      className={withClassName("form", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style, {
        display: styleProps.display ?? "flex",
        flexDirection: "column",
      })}
    >
      {children || "Form"}
    </form>
  );
}

export function Toolbar({ children, htmlProps, ...styleProps }: BaseProps) {
  return (
    <div
      {...htmlProps}
      className={withClassName("toolbar-block", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style, {
        display: styleProps.display ?? "flex",
        alignItems: styleProps.alignItems ?? "center",
        gap: styleProps.gap ?? "8px",
      })}
    >
      {children || "Toolbar"}
    </div>
  );
}

export function Select({
  value,
  options,
  placeholder,
  htmlProps,
  ...styleProps
}: SelectLikeProps) {
  const resolvedOptions = options && options.length > 0
    ? options
    : [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
      ];

  return (
    <select
      {...htmlProps}
      value={value}
      className={withClassName("select", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
      onChange={undefined}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {resolvedOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Dropdown(props: SelectLikeProps) {
  return <Select {...props} />;
}

export function TextArea({
  value,
  placeholder,
  rows = 4,
  htmlProps,
  ...styleProps
}: TextareaProps) {
  return (
    <textarea
      {...htmlProps}
      rows={rows}
      value={value}
      placeholder={placeholder}
      className={withClassName("textarea", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
      onChange={undefined}
    />
  );
}

export function Input({
  value,
  placeholder,
  htmlProps,
  ...styleProps
}: InputLikeProps) {
  return (
    <input
      {...htmlProps}
      value={value}
      placeholder={placeholder}
      className={withClassName("input", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
      onChange={undefined}
    />
  );
}

export function Radio({
  checked,
  label = "Radio option",
  name,
  htmlProps,
  ...styleProps
}: ChoiceProps) {
  return (
    <label
      className={withClassName("choice-field", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style, {
        display: styleProps.display ?? "inline-flex",
        alignItems: "center",
        gap: styleProps.gap ?? "8px",
      })}
    >
      <input {...htmlProps} type="radio" checked={checked} name={name} onChange={undefined} />
      <span>{label}</span>
    </label>
  );
}

export function Checkbox({
  checked,
  label = "Checkbox",
  name,
  htmlProps,
  ...styleProps
}: ChoiceProps) {
  return (
    <label
      className={withClassName("choice-field", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style, {
        display: styleProps.display ?? "inline-flex",
        alignItems: "center",
        gap: styleProps.gap ?? "8px",
      })}
    >
      <input {...htmlProps} type="checkbox" checked={checked} name={name} onChange={undefined} />
      <span>{label}</span>
    </label>
  );
}

export function Switch({
  checked,
  label = "Switch",
  htmlProps,
  ...styleProps
}: ChoiceProps) {
  return (
    <label
      className={withClassName("switch-field", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style, {
        display: styleProps.display ?? "inline-flex",
        alignItems: "center",
        gap: styleProps.gap ?? "10px",
      })}
    >
      <span className={`switch-pill ${checked ? "switch-pill-on" : ""}`}>
        <span className="switch-thumb" />
      </span>
      <input {...htmlProps} type="checkbox" checked={checked} onChange={undefined} hidden />
      <span>{label}</span>
    </label>
  );
}

export function Toggle({
  label = "Toggle",
  pressed,
  htmlProps,
  ...styleProps
}: ToggleProps) {
  return (
    <button
      {...htmlProps}
      type="button"
      aria-pressed={pressed}
      className={withClassName("toggle-button", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      {label}
    </button>
  );
}

export function List({ children, items, htmlProps, ...styleProps }: CollectionProps) {
  return (
    <ul
      {...htmlProps}
      className={withClassName("list", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      {children || renderCollectionItems(items)}
    </ul>
  );
}

export function Menu({ children, items, htmlProps, ...styleProps }: CollectionProps) {
  return (
    <nav
      {...htmlProps}
      className={withClassName("menu", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      {children || <ul>{renderCollectionItems(items)}</ul>}
    </nav>
  );
}

export function Tab({
  label = "Tab",
  pressed,
  htmlProps,
  ...styleProps
}: ToggleProps) {
  return (
    <button
      {...htmlProps}
      type="button"
      aria-selected={pressed}
      className={withClassName("tab", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      {label}
    </button>
  );
}

export function Accordion({
  title = "Accordion",
  open = true,
  children,
  htmlProps,
  ...styleProps
}: AccordionProps) {
  return (
    <details
      {...htmlProps}
      open={open}
      className={withClassName("accordion", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      <summary>{title}</summary>
      <div className="accordion-content">{children || "Accordion content"}</div>
    </details>
  );
}

export function Dialog({
  title = "Dialog",
  description = "Dialog description",
  open = true,
  children,
  htmlProps,
  ...styleProps
}: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      {...htmlProps}
      className={withClassName("dialog", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      <div className="dialog-header">
        <strong>{title}</strong>
      </div>
      <div className="dialog-description">{description}</div>
      <div className="dialog-body">{children || "Dialog content"}</div>
    </div>
  );
}

export function Tooltip({
  title = "Helpful tooltip",
  children,
  htmlProps,
  ...styleProps
}: TooltipProps) {
  return (
    <div
      {...htmlProps}
      className={withClassName("tooltip-block", htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style, {
        display: styleProps.display ?? "inline-flex",
        flexDirection: "column",
        gap: styleProps.gap ?? "6px",
      })}
    >
      <div className="tooltip-bubble">{title}</div>
      <div>{children || "Hover target"}</div>
    </div>
  );
}

export function Table({
  columns,
  rows,
  htmlProps,
  striped = false,
  ...styleProps
}: TableProps) {
  const resolvedColumns = columns && columns.length > 0 ? columns : ["Name", "Role"];
  const resolvedRows =
    rows && rows.length > 0
      ? rows
      : [
          { Name: "Alex", Role: "Designer" },
          { Name: "Riley", Role: "Engineer" },
        ];

  return (
    <table
      {...htmlProps}
      className={withClassName(`table ${striped ? "table-striped" : ""}`.trim(), htmlProps?.className)}
      style={getMergedStyle(styleProps, htmlProps?.style)}
    >
      <thead>
        <tr>
          {resolvedColumns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {resolvedRows.map((row, index) => (
          <tr key={`row-${index}`}>
            {resolvedColumns.map((column) => (
              <td key={`${column}-${index}`}>{String(row[column] ?? "")}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DataTable(props: TableProps) {
  return <Table {...props} striped={props.striped ?? true} />;
}
