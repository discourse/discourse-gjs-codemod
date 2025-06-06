import { transformSync } from "@babel/core";
import { readFileSync } from "node:fs";
import babelTemplate from "@babel/template";
import * as t from "@babel/types";
import connectorTagNames from "./connector-tag-names.js";
import { classify } from "@ember/string";
import { basename } from "node:path";
import { env } from "node:process";

const template = babelTemplate.default;

export default class Converter {
  constructor(file, filename, outletName) {
    this.file = file;

    const connectorName = basename(filename, ".js");
    this.cssClasses = [`${outletName}-outlet`, connectorName];
    this.className = classify(connectorName);

    if (connectorTagNames[outletName] !== undefined) {
      this.tagName = connectorTagNames[outletName];
    } else if (
      connectorTagNames[outletName.replace(/__before$/, "")] !== undefined ||
      connectorTagNames[outletName.replace(/__after$/, "")] !== undefined
    ) {
      this.tagName = "div";
    } else {
      throw new Error(`🚨🚨🚨 Unknown plugin outlet: ${outletName}`);
    }
  }

  createNewClass() {
    this.newContents = [];

    this.newContents.push(
      t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier("Component"))],
        t.stringLiteral("@ember/component")
      )
    );

    const declaration = t.classDeclaration(
      t.identifier(this.className),
      t.identifier("Component"),
      t.classBody([]),
      []
    );

    if (this.tagName !== "div") {
      declaration.decorators.push(
        t.decorator(
          t.callExpression(t.identifier("tagName"), [
            t.stringLiteral(this.tagName),
          ])
        )
      );

      // import { tagName } from "@ember-decorators/component";
      this.newContents.push(
        t.importDeclaration(
          [t.importSpecifier(t.identifier("tagName"), t.identifier("tagName"))],
          t.stringLiteral("@ember-decorators/component")
        )
      );
    }

    if (this.tagName !== "") {
      declaration.decorators.push(
        t.decorator(
          t.callExpression(
            t.identifier("classNames"),
            this.cssClasses.map((c) => t.stringLiteral(c))
          )
        )
      );

      // import { classNames } from "@ember-decorators/component";
      this.newContents.push(
        t.importDeclaration(
          [
            t.importSpecifier(
              t.identifier("classNames"),
              t.identifier("classNames")
            ),
          ],
          t.stringLiteral("@ember-decorators/component")
        )
      );
    }

    this.newContents.push(declaration);

    return declaration;
  }

  extractMethod(name, callback) {
    let method = this.declaration.properties.find(
      (prop) => prop.key.name === name
    );

    if (method) {
      if (method.type === "ObjectProperty") {
        method = t.objectMethod(
          "method",
          t.stringLiteral(name),
          method.value.params,
          t.blockStatement([t.returnStatement(method.value.body)])
        );
      }

      callback(method);
      return method;
    }
  }

  rename(path, method, identifier, replacement) {
    if (!identifier) {
      return;
    }

    path.scope.traverse(method, {
      Identifier(innerPath) {
        if (innerPath.node.name === identifier) {
          innerPath.node.name = replacement;
        }
      },
    });
  }

  renameThisArgs(path, method) {
    path.scope.traverse(method, {
      MemberExpression(innerPath) {
        const { object, property } = innerPath.node;
        if (object.type === "ThisExpression" && property.name === "args") {
          property.name = "outletArgs";
        }
      },
    });
  }

  callSuper(name) {
    return t.expressionStatement(
      t.callExpression(t.memberExpression(t.super(), t.identifier(name)), [
        t.spreadElement(t.identifier("arguments")),
      ])
    );
  }

  handleDestructuring(param) {
    if (param?.type === "ObjectPattern") {
      return t.variableDeclaration("const", [
        t.variableDeclarator(param, t.thisExpression()),
      ]);
    }
  }

  run() {
    let output = transformSync(this.file, {
      plugins: [
        [
          {
            visitor: {
              ExportDefaultDeclaration: (path) => {
                this.declaration = path.node.declaration;

                if (this.declaration.type !== "ObjectExpression") {
                  console.log("not a legacy connector");
                  return;
                }

                const classDeclaration = this.createNewClass();

                const shouldRender = this.extractMethod(
                  "shouldRender",
                  (method) => {
                    this.renameThisArgs(path, method);
                    this.rename(
                      path,
                      method,
                      method.params?.[1]?.name,
                      "context"
                    );
                  }
                );

                const setupComponent = this.extractMethod(
                  "setupComponent",
                  (method) => {
                    this.renameThisArgs(path, method);
                    this.rename(path, method, method.params?.[0]?.name, "this");
                    this.rename(path, method, method.params?.[1]?.name, "this");
                  }
                );

                const teardownComponent = this.extractMethod(
                  "teardownComponent",
                  (method) => {
                    this.renameThisArgs(path, method);
                    this.rename(path, method, method.params?.[0]?.name, "this");
                  }
                );

                if (shouldRender) {
                  classDeclaration.body.body.push(
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
                  const newBody = [
                    this.callSuper("init"),
                    this.handleDestructuring(setupComponent.params[0]),
                    ...setupComponent.body.body,
                  ].filter(Boolean);

                  classDeclaration.body.body.push(
                    t.classMethod(
                      "method",
                      t.identifier("init"),
                      [],
                      t.blockStatement(newBody)
                    )
                  );
                }

                if (teardownComponent) {
                  const newBody = [
                    this.callSuper("willDestroy"),
                    this.handleDestructuring(teardownComponent.params[0]),
                    ...teardownComponent.body.body,
                  ].filter(Boolean);

                  classDeclaration.body.body.push(
                    t.classMethod(
                      "method",
                      t.identifier("willDestroy"),
                      [],
                      t.blockStatement(newBody)
                    )
                  );
                }

                const actions = this.declaration.properties.find(
                  (prop) =>
                    prop.key.name === "actions" &&
                    prop.value.type === "ObjectExpression"
                );

                if (actions) {
                  this.newContents.unshift(
                    t.importDeclaration(
                      [
                        t.importSpecifier(
                          t.identifier("action"),
                          t.identifier("action")
                        ),
                      ],
                      t.stringLiteral("@ember/object")
                    )
                  );

                  for (const action of actions.value.properties) {
                    const method = t.classMethod(
                      "method",
                      t.identifier(action.key.name),
                      action.params,
                      action.body,
                      false,
                      false,
                      false,
                      action.async
                    );

                    method.decorators = [t.decorator(t.identifier("action"))];
                    this.renameThisArgs(path, method);

                    classDeclaration.body.body.push(method);
                  }
                }

                path.replaceWithMultiple(this.newContents);
              },
            },
          },
        ],
      ],
    }).code;

    return output.replace(
      `class ${this.className}`,
      `export default class ${this.className}`
    );
  }
}
