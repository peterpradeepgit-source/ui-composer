import type { CSSProperties } from "react";
import { getCommonStyle, type CommonStyleProps, type SerializableHtmlProps } from "./styleProps";

type TextProps = CommonStyleProps & {
  text: string;
  children?: React.ReactNode;
  fontFamily?: string;
  letterSpacing?: string;
  textTransform?: CSSProperties["textTransform"];
  fontStyle?: CSSProperties["fontStyle"];
  textDecoration?: string;
  whiteSpace?: CSSProperties["whiteSpace"];
  htmlProps?: SerializableHtmlProps;
};

export function Text({
  text = "",
  children,
  fontFamily,
  letterSpacing,
  textTransform,
  fontStyle,
  textDecoration,
  whiteSpace,
  htmlProps,
  ...styleProps
}: TextProps) {
  const style: CSSProperties = {
    ...htmlProps?.style,
    ...getCommonStyle(styleProps),
    fontFamily,
    letterSpacing,
    textTransform,
    fontStyle,
    textDecoration,
    whiteSpace,
  };

  return (
    <div
      {...htmlProps}
      className={htmlProps?.className ? `text ${htmlProps.className}` : "text"}
      style={style}
    >
      <span>{text}</span>
      <span>{children}</span>
    </div>
  );
}
