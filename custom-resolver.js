import { globSync, readFileSync } from "node:fs";
import discourse from "./core-modules/discourse.js";
import admin from "./core-modules/admin.js";
import dialogHolder from "./core-modules/dialog-holder.js";
import floatKit from "./core-modules/float-kit.js";
import selectKit from "./core-modules/select-kit.js";
import truthHelpers from "./core-modules/truth-helpers.js";
import { relative, dirname } from "node:path";

const packageName = process.env.PACKAGE_NAME;
const coreModules = [
  discourse,
  admin,
  dialogHolder,
  floatKit,
  selectKit,
  truthHelpers,
];

function itemExists(path) {
  return (
    globSync(`${path}.{js,gjs,hbs}`).length ||
    globSync(`${path}/index.{js,gjs,hbs}`).length
  );
}

function findCoreModule(type, name) {
  for (const mod of coreModules) {
    if (mod[type][name]) {
      return mod[type][name];
    }
  }
}

function findItem(type, name) {
  const coreModule = findCoreModule(type, name);
  if (coreModule) {
    return coreModule;
  }

  // target plugin
  if (itemExists(`./assets/javascripts/discourse/${type}/${name}`)) {
    return `discourse/plugins/${packageName}/discourse/${type}/${name}`;
  } else if (itemExists(`./admin/assets/javascripts/admin/${type}/${name}`)) {
    return `discourse/plugins/${packageName}/admin/${type}/${name}`;
  } else if (itemExists(`./javascripts/discourse/${type}/${name}`)) {
    return `_fake_theme/discourse/${type}/${name}`;
  }
}

export default async function (path, filename) {
  if (!path.startsWith("@embroider/virtual/")) {
    return;
  }

  const [, type, name] = path.match(/@embroider\/virtual\/(.+?)\/([^.]+)/);

  let result;
  if (type === "ambiguous") {
    result = findItem("components", name) || findItem("helpers", name);
  } else {
    result = findItem(type, name);
  }

  if (!result) {
    return;
  }

  const sourceModulePath = filename
    .replace(
      /^assets\/javascripts\/discourse/,
      `discourse/plugins/${packageName}/discourse`
    )
    .replace(
      /^admin\/assets\/javascripts\/admin/,
      `discourse/plugins/${packageName}/admin`
    )
    .replace(/^javascripts\/discourse/, `_fake_theme/discourse`);

  if (
    (result.startsWith("discourse/plugins") &&
      sourceModulePath.startsWith("discourse/plugins")) ||
    (result.startsWith("_fake_theme/") &&
      sourceModulePath.startsWith("_fake_theme/"))
  ) {
    const relativePath = relative(dirname(sourceModulePath), result);
    result = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
  }

  return result;
}
