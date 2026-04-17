import assert from "node:assert/strict";
import test from "node:test";
import {
  createDesignJsonFile,
  isBuilderNode,
  parseDesignJson,
  serializeDesign,
} from "./designJson.ts";
import type { BuilderNode } from "../core/types.ts";

const design: BuilderNode = {
  id: "root",
  type: "Container",
  props: {
    width: "100%",
  },
  children: [
    {
      id: "text-1",
      type: "Text",
      props: {
        text: "Hello",
      },
      children: [],
    },
  ],
};

test("serializeDesign and parseDesignJson preserve valid builder trees", () => {
  const serialized = serializeDesign(design);

  assert.deepEqual(parseDesignJson(serialized), design);
  assert.equal(serialized.endsWith("\n"), true);
});

test("parseDesignJson rejects invalid builder trees", () => {
  assert.throws(
    () => parseDesignJson(JSON.stringify({ id: "root", type: "Container" })),
    /not a valid ui-composer-react design JSON file/,
  );
  assert.equal(isBuilderNode({ id: "root", type: "Container" }), false);
});

test("createDesignJsonFile sanitizes filenames", () => {
  const file = createDesignJsonFile(design, "Landing Page.json");

  assert.equal(file.path, "Landing-Page.json");
  assert.deepEqual(JSON.parse(file.contents), design);
});
