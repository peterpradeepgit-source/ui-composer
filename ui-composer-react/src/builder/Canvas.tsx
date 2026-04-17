import { useBuilder } from "./useBuilder";
import { RenderNode } from "./RenderNode";

export function Canvas() {
  const { history } = useBuilder();
  const isEmpty = history.present.children.length === 0;

  return (
    <div className="canvas canvas-area">
      {isEmpty ? (
        <div className="canvas-empty-state">
          <p className="eyebrow">Start here</p>
          <h2>Drag a component onto the canvas</h2>
          <p>
            Build your layout from the Components panel. Export and save actions
            unlock once your sandbox has content.
          </p>
        </div>
      ) : null}
      <RenderNode node={history.present} isRoot />
    </div>
  );
}
