/* eslint-env mocha */

const utils = require('./test-utils');

const contacts = require(utils.contactFile);
const { expect } = utils;
const { runApp } = utils;

describe('app at step 1', () => {
  let outputLines;

  before('run the app and collect output', (done) => {
    runApp(
      'list',
      (outputLines_) => {
        outputLines = outputLines_;
        done();
      },
      done,
    );
  });

  it('outputs as many lines as there are contacts in contacts.json', () => {
    expect(outputLines).to.have.length(contacts.length);
  });

  it("outputs contacts in the format 'LASTNAME Firstname'", () => {
    expect(outputLines).to.all.match(/^[A-Z]+ [A-Z][a-z]*$/);
  });

  it('outputs all names (first and last) present in contacts.json', () => {
    const allNames = outputLines.join().toLowerCase();
    contacts.forEach((contact) => {
      expect(allNames).to.contain(contact.firstName.toLowerCase());
      expect(allNames).to.contain(contact.lastName.toLowerCase());
    });
  });
});
