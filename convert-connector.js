import { transformSync } from "@babel/core";
import { readFileSync } from "node:fs";
import template from "@babel/template";
import * as t from "@babel/types";
import connectorTagNames from "./connector-tag-names.js";
import { classify } from "@ember/string";
import { basename } from "node:path";

const fileName = process.argv[2];

const file = readFileSync(fileName, "utf8");
const outletName = process.argv[3];
const connectorName = basename(fileName, ".js");

const tagName = connectorTagNames[outletName];
const cssClasses = [`${outletName}-outlet`, connectorName];
const className = classify(connectorName);

let output = transformSync(file, {
  plugins: [
    [
      {
        visitor: {
          ExportDefaultDeclaration(path) {
            const declaration = path.node.declaration;

            if (declaration.type !== "ObjectExpression") {
              console.log("not an old connector");
              return;
            }

            const shouldRender = declaration.properties.find(
              (prop) => prop.key.name === "shouldRender"
            );
            let shouldRenderBody = t.emptyStatement();
            if (shouldRender) {
              shouldRenderBody = shouldRender.body.body;

              const secondParamName = shouldRender.params[1]?.name;
              if (secondParamName) {
                path.scope.traverse(shouldRender, {
                  Identifier(innerPath) {
                    if (innerPath.node.name === "component") {
                      innerPath.node.name = "context";
                    }
                  },
                });
              }
            }

            const setupComponent = declaration.properties.find(
              (prop) => prop.key.name === "setupComponent"
            );
            let setupComponentBody = t.emptyStatement();
            if (setupComponent) {
              setupComponentBody = setupComponent.body.body;

              const firstParamName = setupComponent.params[0]?.name;
              const secondParamName = setupComponent.params[1]?.name;

              if (firstParamName) {
                path.scope.traverse(setupComponent, {
                  Identifier(innerPath) {
                    if (innerPath.node.name === firstParamName) {
                      innerPath.node.name = "this";
                    }
                  },
                });
              }

              if (secondParamName) {
                path.scope.traverse(setupComponent, {
                  Identifier(innerPath) {
                    if (innerPath.node.name === secondParamName) {
                      innerPath.node.name = "this";
                    }
                  },
                });
              }
            }

            const classDeclaration = template.default({
              plugins: ["decorators-legacy"],
            })`
              import Component from "@ember/component";
              import {
                classNames,
                tagName,
              } from "@ember-decorators/component";

              @tagName("${tagName}")
              @classNames(${cssClasses.map((c) => "'" + c + "'").join(", ")})
              class ${className} extends Component {
                static shouldRender(args, context) {
                  ${shouldRenderBody}
                }

                init() {
                  super.init(...arguments);

                  ${setupComponentBody}
                }
              }
            `();

            path.replaceWithMultiple(classDeclaration);
          },
        },
      },
    ],
  ],
}).code;

output = output.replace(
  `class ${className}`,
  `export default class ${className}`
);

console.log(output);
