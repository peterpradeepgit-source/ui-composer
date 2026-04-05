import { Children } from "react";
import type { CSSProperties } from "react";
import {
  getCommonStyle,
  type CommonStyleProps,
  type SerializableHtmlProps,
} from "./styleProps";

type ContainerProps = CommonStyleProps & {
  children?: React.ReactNode;
  isRoot?: boolean;
  direction?: "column" | "row";
  htmlProps?: SerializableHtmlProps;
};

export function Container({
  children,
  width = "320px",
  height,
  minWidth,
  minHeight = "84px",
  maxWidth,
  maxHeight,
  padding = "20px",
  margin,
  border = "1px dashed #ccc",
  borderRadius = "4px",
  background,
  backgroundColor = "#f9f9f9",
  color,
  textAlign,
  justifyContent,
  alignItems,
  alignSelf,
  gap = "10px",
  display = "flex",
  fontSize,
  fontWeight,
  lineHeight,
  isRoot = false,
  direction = "column",
  htmlProps,
}: ContainerProps) {
  const hasChildren = Children.count(children) > 0;
  const containerClassName = `container ${isRoot ? "container-root" : "container-nested"} ${hasChildren ? "" : "container-empty"}`.trim();
  const mergedStyle: CSSProperties = {
    ...htmlProps?.style,
    ...getCommonStyle({
      width,
      minHeight,
      height,
      minWidth,
      maxWidth,
      maxHeight,
      padding,
      margin,
      border,
      borderRadius,
      background,
      backgroundColor,
      color,
      textAlign,
      justifyContent,
      alignItems,
      alignSelf,
      gap,
      display,
      fontSize,
      fontWeight,
      lineHeight,
    }),
    flexDirection: direction,
  };

  if (isRoot) {
    mergedStyle.width ??= "100%";
    mergedStyle.minHeight ??= "100%";
  }

  return (
    <div
      {...htmlProps}
      className={htmlProps?.className
        ? `${containerClassName} ${htmlProps.className}`
        : containerClassName}
      style={mergedStyle}
    >
      {hasChildren ? children : <span className="container-placeholder">Drop components inside</span>}
    </div>
  );
}
