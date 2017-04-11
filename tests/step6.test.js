/* eslint-env mocha */

const { runApp } = require('./test-utils');


describe('app at step 6', () => {
  it('supports update command', (done) => {
    runApp('-- --memory --promise update a b c', () => done(), done);
  });
});
