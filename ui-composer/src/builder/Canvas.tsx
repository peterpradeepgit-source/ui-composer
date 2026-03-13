import { useBuilder } from "./BuilderContext";
import { RenderNode } from "./RenderNode";

export function Canvas() {
  const { history } = useBuilder();
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        padding: 20,
        position: "relative",
        flex: 1,
        backgroundColor: "#fff",
      }}
      className="canvas-area"
    >
      <RenderNode node={history.present} />
    </div>
  );
}
