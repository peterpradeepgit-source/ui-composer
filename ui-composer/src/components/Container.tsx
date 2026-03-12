export function Container({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px dashed #ccc",
        borderRadius: "4px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {children}
    </div>
  );
}
