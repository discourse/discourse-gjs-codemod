import { globSync, readFileSync } from "node:fs";
import discourse from "./modules/discourse.js";
import admin from "./modules/admin.js";
import dialogHolder from "./modules/dialog-holder.js";
import floatKit from "./modules/float-kit.js";
import selectKit from "./modules/select-kit.js";
import truthHelpers from "./modules/truth-helpers.js";
import renderModifiers from "./modules/render-modifiers.js";
import { relative, dirname } from "node:path";

const packageName = process.env.PACKAGE_NAME;
const modules = [
  discourse,
  admin,
  dialogHolder,
  floatKit,
  selectKit,
  truthHelpers,
  renderModifiers,
];

function itemExists(path) {
  return (
    globSync(`${path}.{js,gjs,hbs}`).length ||
    globSync(`${path}/index.{js,gjs,hbs}`).length
  );
}

function findModule(type, name) {
  for (const mod of modules) {
    if (mod[type]?.[name]) {
      return mod[type]?.[name];
    }
  }
}

function findItem(type, name) {
  const module = findModule(type, name);
  if (module) {
    return module;
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
    (result.startsWith(`discourse/plugins/${packageName}/`) &&
      sourceModulePath.startsWith(`discourse/plugins/${packageName}/`)) ||
    (result.startsWith("_fake_theme/") &&
      sourceModulePath.startsWith("_fake_theme/"))
  ) {
    const relativePath = relative(dirname(sourceModulePath), result);
    result = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
  }

  return result;
}
