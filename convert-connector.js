import { transformSync } from "@babel/core";
import { readFileSync } from "node:fs";
import template from "@babel/template";
import * as t from "@babel/types";
import connectorTagNames from "./connector-tag-names.js";
import { classify } from "@ember/string";
import { basename } from "node:path";

if (process.argv.length !== 4) {
  console.error(
    "usage: node ./convert-connector.js [path-to-a-connector.js] [outlet-name]"
  );
  process.exit(1);
}

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
            if (shouldRender) {
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
            if (setupComponent) {
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

            const newContents = template.default({
              plugins: ["decorators-legacy"],
            })`
              import Component from "@ember/component";
              import {
                classNames,
                tagName,
              } from "@ember-decorators/component";

              @tagName("${tagName}")
              @classNames(${cssClasses.map((c) => "'" + c + "'").join(", ")})
              class ${className} extends Component {}
            `();

            // TODO: handle the actions object
            // TODO: handle the third shouldRender arg: owner
            // TODO: handle arg destructuring, e.g. setupComponent({ model }, component) {

            const ClassDeclaration = newContents.find(
              (node) => node.type === "ClassDeclaration"
            );

            if (shouldRender) {
              ClassDeclaration.body.body.push(
                t.classMethod(
                  "method",
                  t.identifier("shouldRender"),
                  shouldRender.params,
                  t.blockStatement(shouldRender.body.body),
                  false,
                  true
                )
              );
            }

            if (setupComponent) {
              ClassDeclaration.body.body.push(
                t.classMethod(
                  "method",
                  t.identifier("init"),
                  [],
                  t.blockStatement([
                    t.expressionStatement(
                      t.callExpression(
                        t.memberExpression(t.super(), t.identifier("init")),
                        [t.spreadElement(t.identifier("arguments"))]
                      )
                    ),
                    ...setupComponent.body.body,
                  ])
                )
              );
            }

            path.replaceWithMultiple(newContents);
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
