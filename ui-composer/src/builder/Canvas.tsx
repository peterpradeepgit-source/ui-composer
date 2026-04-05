import { useBuilder } from "./useBuilder";
import { RenderNode } from "./RenderNode";

export function Canvas() {
  const { history } = useBuilder();
  return (
    <div className="canvas canvas-area">
      <RenderNode node={history.present} isRoot />
    </div>
  );
}
