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
let errors = [];

try {
  await execa({ stdio: "inherit" })`pnpm install`;

  const packageName = parsed.name || basename(cwd());
  let completedRun = false;

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

  if (!completedRun) {
    throw new Error("template-tag-codemod failed!");
  }

  const modifiedFiles = (await execa`git status --porcelain`).stdout
    .split("\n")
    .map((line) => line.match(/^( M|\?\?) (.+\.gjs)$/)?.[2])
    .filter(Boolean);

  for (const name of modifiedFiles) {
    let contents = readFileSync(name, "utf8");

    if (/\bi18n0\b/.test(contents)) {
      console.log(`replacing 'i18n0' in ${name}`);
      contents = contents.replace(
        /import i18n0 from ['"]discourse\/helpers\/i18n['"];/,
        ""
      );
      contents = contents.replace(/\bi18n0\b/g, "i18n");
      writeFileSync(name, contents);
    }

    if (contents.includes("RouteTemplate")) {
      if (/\{\{action ["']([^"']+)["']\}\}/.test(contents)) {
        console.log(`replacing string-based action in a route in ${name}`);
        contents = contents.replace(
          /\{\{action ["']([^"']+)["']\}\}/g,
          "{{@controller.$1}}"
        );
      }

      if (/\{\{action ["']([^"']+)["']/.test(contents)) {
        errors.push(
          `⚠️ please convert a string-based action in a route in ${name}`
        );
      }

      writeFileSync(name, contents);
    }
  }

  await execa({ stdio: "inherit" })`pnpm eslint --fix`;
  await execa({ stdio: "inherit" })`pnpm prettier --write **/*.{js,gjs}`;
} finally {
  writeFileSync("./package.json", originalPackageJson);
  await execa({ stdio: "inherit" })`pnpm install`;
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }

  process.exit(1);
}
