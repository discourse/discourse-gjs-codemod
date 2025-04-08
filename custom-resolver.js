import { globSync, readFileSync } from "node:fs";
import discourseModules from "./exports/discourse.js";

const pluginName = JSON.parse(readFileSync("./package.json")).name;

const roots = [
  "discourse/app",
  "admin/addon",
  "select-kit/addon",
  "float-kit/addon",
  "dialog-holder/addon",
];

function itemExists(path) {
  return (
    globSync(`${path}.{js,gjs,hbs}`).length ||
    globSync(`${path}/index.{js,gjs,hbs}`).length
  );
}

function findItem(type, name) {
  // core and bundled addons
  // for (let location of roots) {
  //   const pkg = location.match(/(.+)\//)[1];
  //   if (itemExists(`../../app/assets/javascripts/${location}/${name}`)) {
  //     return `${pkg}/${name}`;
  //   }
  // }

  if (discourseModules[type][name]) {
    return discourseModules[type][name];
  }

  // target plugin
  if (itemExists(`./assets/javascripts/discourse/${type}/${name}`)) {
    return `discourse/plugins/${pluginName}/discourse/${type}/${name}`;
  } else if (itemExists(`./admin/assets/javascripts/admin/${type}/${name}`)) {
    return `discourse/plugins/${pluginName}/admin/${type}/${name}`;
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
