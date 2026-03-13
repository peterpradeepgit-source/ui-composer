import { nanoid } from "nanoid";
import { useBuilder } from "./BuilderContext";
import { RenderNode } from "./RenderNode";
import { insertNode } from "../core/tree";
import { applyChange } from "../core/history";

export function Canvas() {
  const { history, setHistory } = useBuilder();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 20,
        flex: 1,
        backgroundColor: "#fff",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const type = e.dataTransfer.getData("component-type");
        if (!type) return;
        const newNode = {
          id: nanoid(),
          type,
          props: {},
          children: [],
        };
        const newTree = structuredClone(history.present);
        insertNode(newTree, "root", newNode);
        setHistory(applyChange(history, newTree));
      }}
    >
      <RenderNode node={history.present} />
    </div>
  );
}
