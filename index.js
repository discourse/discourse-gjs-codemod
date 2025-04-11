import { basename, dirname, join } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import { execa } from "execa";

let location = import.meta.resolve("@embroider/template-tag-codemod");
let cli = join(dirname(fileURLToPath(location)), "cli.js");

const originalPackageJson = readFileSync("./package.json", "utf8");

let parsed = JSON.parse(originalPackageJson);
parsed = {
  ...parsed,
  dependencies: {
    ...parsed.dependencies,
    "@ember/optional-features": "^2.2.0",
    "ember-auto-import": "^2.10.0",
    "ember-cli": "~6.3.0",
    "ember-source": "~5.12.0",
  },
  "ember-addon": {
    version: 2,
    type: "addon",
  },
  ember: {
    edition: "octane",
  },
  exports: {
    "./tests/*": "./tests/*",
    "./*": "./app/*",
  },
};

writeFileSync("./package.json", JSON.stringify(parsed));
let completedRun = false;

try {
  await execa({ stdio: "inherit" })`pnpm install`;

  const packageName = parsed.name || basename(cwd());

  await execa({
    stdout: function* (line) {
      console.log(line);
      if (line.includes("Completed run")) {
        completedRun = true;
      }
    },
    env: { FORCE_COLOR: true, PACKAGE_NAME: packageName },
  })`${cli}
      --relativeLocalPaths=false
      --nativeRouteTemplates=false
      --nativeLexicalThis=false
      --templateInsertion=end
      --addNameToTemplateOnly
      --renderTests=test/**/*.js
      --routeTemplates=**/templates/**/*.hbs
      --components=**/components/**/*.hbs
      --customResolver=${join(import.meta.dirname, "custom-resolver.js")}
      --renamingRules=${join(import.meta.dirname, "rules.js")}
  `;
} catch (error) {
  if (!completedRun) {
    console.error(error);
  }
} finally {
  writeFileSync("./package.json", originalPackageJson);
  await execa({ stdio: "inherit" })`pnpm install`;
}
