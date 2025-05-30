import { strict as assert } from "node:assert";
import test from "node:test";
import Converter from "./convert-connector.js";

const divOutletName = "user-preferences-notifications";
const filename = "notify-code-review.js";
const input = `
export default {
  setupComponent(args, component) {
    const user = args.model;
    this.set(
      "notifyOnCodeReviews",
      user.custom_fields.notify_on_code_reviews !== false
    );

    component.addObserver("notifyOnCodeReviews", () => {
      user.set(
        "custom_fields.notify_on_code_reviews",
        component.get("notifyOnCodeReviews")
      );
    });

    this.args.bar();
  },
  shouldRender(args, component) {
    return component.currentUser && component.currentUser.admin;
  },
  actions: {
    foo() {
      this.args.bar();
    }
  }
};
`.trim();

const expectedOutput = `
import { action } from "@ember/object";
import Component from "@ember/component";
import { classNames, tagName } from "@ember-decorators/component";
@classNames('user-preferences-notifications-outlet', 'notify-code-review')
export default class NotifyCodeReview extends Component {
  static shouldRender(args, context) {
    return context.currentUser && context.currentUser.admin;
  }
  init() {
    super.init(...arguments);
    const user = this.model;
    this.set("notifyOnCodeReviews", user.custom_fields.notify_on_code_reviews !== false);
    this.addObserver("notifyOnCodeReviews", () => {
      user.set("custom_fields.notify_on_code_reviews", this.get("notifyOnCodeReviews"));
    });
    this.outletArgs.bar();
  }
  @action
  foo() {
    this.outletArgs.bar();
  }
}
`.trim();

test("converts given connector from the legacy format to an ember component", () => {
  const converter = new Converter(input, filename, divOutletName);
  const output = converter.run();

  assert.equal(output.trim(), expectedOutput);
});

const outletName = "main-outlet-bottom";
const arrowFuncInput = `
export default {
  shouldRender: (args, c) => args && args.editorType === "composer" && c.currentUser,
};
`.trim();

const arrowFuncExpectedOutput = `
import Component from "@ember/component";
import { classNames, tagName } from "@ember-decorators/component";
@tagName("")
@classNames('main-outlet-bottom-outlet', 'notify-code-review')
export default class NotifyCodeReview extends Component {
  static shouldRender(args, context) {
    return args && args.editorType === "composer" && context.currentUser;
  }
}
`.trim();

test("converts arrow functions", () => {
  const converter = new Converter(arrowFuncInput, filename, outletName);
  const output = converter.run();

  assert.equal(output.trim(), arrowFuncExpectedOutput);
});
