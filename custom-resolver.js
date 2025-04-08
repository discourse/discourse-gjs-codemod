import { globSync, readFileSync } from "node:fs";
import discourse from "./core-modules/discourse.js";
import admin from "./core-modules/admin.js";
import dialogHolder from "./core-modules/dialog-holder.js";
import floatKit from "./core-modules/float-kit.js";
import selectKit from "./core-modules/select-kit.js";
import truthHelpers from "./core-modules/truth-helpers.js";

const packageName = process.env.PACKAGE_NAME;

function itemExists(path) {
  return (
    globSync(`${path}.{js,gjs,hbs}`).length ||
    globSync(`${path}/index.{js,gjs,hbs}`).length
  );
}

function findItem(type, name) {
  if (discourse[type][name]) {
    return discourse[type][name];
  } else if (admin[type][name]) {
    return admin[type][name];
  } else if (dialogHolder[type][name]) {
    return dialogHolder[type][name];
  } else if (floatKit[type][name]) {
    return floatKit[type][name];
  } else if (selectKit[type][name]) {
    return selectKit[type][name];
  } else if (truthHelpers[type][name]) {
    return truthHelpers[type][name];
  }

  // target plugin
  if (itemExists(`./assets/javascripts/discourse/${type}/${name}`)) {
    return `discourse/plugins/${packageName}/discourse/${type}/${name}`;
  } else if (itemExists(`./admin/assets/javascripts/admin/${type}/${name}`)) {
    return `discourse/plugins/${packageName}/admin/${type}/${name}`;
  }
}

export default async function (path) {
  if (!path.startsWith("@embroider/virtual/")) {
    return;
  }

  const [, type, name] = path.match(/@embroider\/virtual\/(.+?)\/([^.]+)/);

  if (type === "ambiguous") {
    return findItem("components", name) || findItem("helpers", name);
  }

  return findItem(type, name);
}
