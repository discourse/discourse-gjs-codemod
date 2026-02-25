import { strict as assert } from "node:assert";
import test from "node:test";
import { replaceStyleguideImports } from "./styleguide-imports.js";

test("replaces styleguide imports with optionalRequire calls", () => {
  const input = `
import { i18n } from "discourse-i18n";
import StyleguideComponent from "discourse/plugins/styleguide/discourse/components/styleguide/component";

const label = i18n("ok");
`.trim();

  const expectedOutput = `
import { i18n } from "discourse-i18n";
import { optionalRequire } from "discourse/lib/utilities";
const StyleguideComponent = optionalRequire("discourse/plugins/styleguide/discourse/components/styleguide/component");

const label = i18n("ok");
`.trim();

  const output = replaceStyleguideImports(input);
  assert.equal(output.trim(), expectedOutput);
});
