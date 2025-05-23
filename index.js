import { basename, dirname, join } from "node:path";
import { cwd, env, exit } from "node:process";
import { fileURLToPath } from "node:url";
import { globSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execa } from "execa";
import Converter from "./convert-connector.js";

const defaultGlimmerOutlets = [
  "conditional-loading-spinner",
  "fast-edit-footer-after",
  "google-search",
  "group-info-details",
  "post-text-buttons",
  "discovery-list-area",
  "topic-map-expanded-after",
  "chat-join-channel-button",
];

const originalPackageJson = readFileSync("package.json", "utf8");
let parsed = JSON.parse(originalPackageJson);
const packageName = env.PACKAGE_NAME || parsed.name || basename(cwd());

// First, search for the deprecated api method and bail if found
const result = await execa({
  reject: false,
})`grep --include=*.js --include=*.gjs -r javascripts -r assets -e registerConnectorClass`;
if (result.exitCode === 0) {
  console.error("Found uses of 'registerConnectorClass'. Fix those first:");
  console.error(result.stdout);
  exit(1);
}

// For each unique "{outletName}-{connectorName}" in **/connectors/{*outletName}/{*connectorName}.{js,hbs}
// - if it's only an hbs and is on THE GLIMMER LIST (TODO): skip
// - if it's only an hbs and isn't on the list: add a boilerplate templateOnly js file
// - if it's a combo or just js: check for the legacy connector indicators
//   - if it's a legacy connector - run the converter
//   - otherwise: skip
//
// using the list - run the template tag codemod as if those files were components

const files = globSync("{assets,javascripts}/**/connectors/**/*.{js,hbs}");
const connectors = new Map();
for (const file of files) {
  const [, path, outletName, connectorName, extension] = file.match(
    /^(.+\/connectors)\/([^\/]+)\/([^\.]+)\.(js|hbs)$/
  );

  const key = `${path}/${outletName}/${connectorName}`;
  if (connectors.has(key)) {
    const connector = connectors.get(key);
    connector.extensions.push(extension);
  } else {
    connectors.set(key, { outletName, connectorName, extensions: [extension] });
  }
}

// TODO: get rid of decoratePluginOutlet

console.log("Found connectors:\n");
for (const [path, { outletName, connectorName, extensions }] of connectors) {
  console.log(`${outletName}\t⬅️\t${connectorName}`);

  if (extensions.length === 1 && extensions[0] === "hbs") {
    if (defaultGlimmerOutlets.includes(outletName)) {
      console.log(`${connectorName} is a 'defaultGlimmer' connector`);
    } else {
      writeFileSync(`./${path}.js`, "export default {};");
    }
  } else {
    const filename = `${path}.js`;
    const file = readFileSync(filename, "utf8");
    const isLegacy = file.includes("export default {");
    if (isLegacy) {
      const converter = new Converter(file, filename, outletName);
      const output = converter.run();
      writeFileSync(filename, output);
    }
  }
}

async function runTemplateTagCodemod({
  renderTests,
  routeTemplates,
  components,
}) {
  const location = import.meta.resolve("@embroider/template-tag-codemod");
  const cli = join(dirname(fileURLToPath(location)), "cli.js");
  let completedRun = false;

  await execa(
    cli,
    [
      "--relativeLocalPaths=false",
      "--nativeRouteTemplates=false",
      "--nativeLexicalThis=false",
      "--templateInsertion=end",
      "--addNameToTemplateOnly",
      `--customResolver=${join(import.meta.dirname, "custom-resolver.js")}`,
      `--renamingRules=${join(import.meta.dirname, "rules.js")}`,
      renderTests ? `--renderTests=${renderTests}` : null,
      routeTemplates ? `--routeTemplates=${routeTemplates}` : null,
      components ? `--components=${components}` : null,
    ].filter(Boolean),
    {
      stdout: function* (line) {
        console.log(line);
        if (line.includes("Completed run")) {
          completedRun = true;
        }
      },
      env: { FORCE_COLOR: true, PACKAGE_NAME: packageName },
    }
  );

  if (!completedRun) {
    throw new Error("template-tag-codemod failed!");
  }
}

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

writeFileSync("package.json", JSON.stringify(parsed));
mkdirSync("config", { recursive: true });
let errors = [];

try {
  await execa({ stdio: "inherit" })`pnpm install`;

  await runTemplateTagCodemod({ components: "**/connectors/**/*.hbs" });
  await runTemplateTagCodemod({
    renderTests: "test/**/*.js",
    routeTemplates: "**/templates/**/*.hbs",
    components: "**/components/**/*.hbs",
  });

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

      if (/\s(\{\{|\()action\b/.test(contents)) {
        errors.push(
          `⚠️ please convert a string-based action in a route in ${name}`
        );
      }

      writeFileSync(name, contents);
    }
  }

  await execa({ stdio: "inherit" })`pnpm eslint --fix`;
  await execa({
    stdio: "inherit",
  })`pnpm prettier --write **/*.{js,gjs} --no-error-on-unmatched-pattern`;
} finally {
  writeFileSync("./package.json", originalPackageJson);
  await execa({ stdio: "inherit" })`pnpm install`;
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }

  exit(1);
}
