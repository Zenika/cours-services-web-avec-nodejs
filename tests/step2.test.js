/* eslint-env mocha */

const { expect, runApp } = require('./test-utils');

describe('app at step 2', () => {
  it("outputs commander's help when no command is specified", (done) => {
    runApp('', (outputLines) => {
      expect(outputLines).to.include.something.that.match(/^\s+Usage:/);
      expect(outputLines).to.include.something.that.match(/^\s+Commands:$/);
      expect(outputLines).to.include.something.that.match(/^\s+list/);
      expect(outputLines).to.include.something.that.match(/^\s+Options:$/);
      expect(outputLines).to.include.something.that.match(/--help/);
      done();
    });
  });
});
