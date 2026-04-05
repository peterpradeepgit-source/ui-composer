import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { getCommonStyle, type CommonStyleProps } from "./styleProps";

type SerializableButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "style"
> & {
  style?: CSSProperties;
};

type ButtonProps = CommonStyleProps & {
  children?: React.ReactNode;
  htmlProps?: SerializableButtonProps;
};

export function Button({ children, htmlProps, ...styleProps }: ButtonProps) {
  const style: CSSProperties = {
    ...htmlProps?.style,
    ...getCommonStyle(styleProps),
  };

  return (
    <button
      {...htmlProps}
      className={htmlProps?.className ? `button ${htmlProps.className}` : "button"}
      style={style}
    >
      {children || "Button"}
    </button>
  );
}
