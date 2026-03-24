export function Button({ children }: { children?: React.ReactNode }) {
  return <button className="button">{children || "Button"}</button>;
}
