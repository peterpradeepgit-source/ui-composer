import { layoutDemo } from "./demo/layout";
import { UIComposer } from "./UIComposer";

export default function App() {
  return <UIComposer initialLayout={layoutDemo} />;
}
