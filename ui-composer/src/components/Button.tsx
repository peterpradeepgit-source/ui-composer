export function Button({ children }: { children?: React.ReactNode }) {
  return (
    <button
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
      }}
    >
      {children || "Button"}
    </button>
  );
}
