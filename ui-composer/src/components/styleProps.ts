import type { CSSProperties, HTMLAttributes } from "react";

export type SerializableHtmlProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "style"
> & {
  style?: CSSProperties;
};

export type CommonStyleProps = {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
  background?: string;
  backgroundColor?: string;
  color?: string;
  textAlign?: CSSProperties["textAlign"];
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  alignSelf?: CSSProperties["alignSelf"];
  gap?: string;
  display?: CSSProperties["display"];
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
};

export function getCommonStyle({
  width,
  height,
  minWidth,
  minHeight,
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
}: CommonStyleProps): CSSProperties {
  return {
    width,
    height,
    minWidth,
    minHeight,
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
  };
}
