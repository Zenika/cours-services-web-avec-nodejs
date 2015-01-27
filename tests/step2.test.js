/* eslint-env mocha */
"use strict";

const utils = require("./test-utils");
const expect = utils.expect;
const runApp = utils.runApp;

describe("app at step 2", function () {

  it("outputs commander's help when no command is specified", function (done) {
    runApp("", function (outputLines) {
      expect(outputLines).to.include.something.that.match(/^\s+Usage:/);
      expect(outputLines).to.include.something.that.match(/^\s+Commands:$/);
      expect(outputLines).to.include.something.that.match(/^\s+list/);
      expect(outputLines).to.include.something.that.match(/^\s+Options:$/);
      expect(outputLines).to.include.something.that.match(/--help/);
      done();
    });
  });

});
