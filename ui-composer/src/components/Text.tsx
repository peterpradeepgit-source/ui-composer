type props = {
  text: string;
  children?: React.ReactNode;
};

export function Text({ text = "", children }: props) {
  return (
    <div className="text">
      <span>{text}</span>
      <span>{children}</span>
    </div>
  );
}
