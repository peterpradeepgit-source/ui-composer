import { RenderNode } from "./builder/RenderNode";
import { registerDefaults } from "./core/registerDefaults";
import { layoutDemo } from "./demo/layout";

registerDefaults();
export default function App() {
  return (
    <div className="App">
      <h1>UI Composer</h1>
      <RenderNode node={layoutDemo} />
    </div>
  );
}
