/* eslint-env mocha */
"use strict";

const utils = require("./test-utils");
const contacts = require(utils.contactFile);
const expect = utils.expect;
const runApp = utils.runApp;

describe("app at step 1", function () {

  let outputLines;

  before("run the app and collect output", function (done) {
    runApp("list", function (outputLines_) {
      outputLines = outputLines_;
      done();
    }, done);
  });

  it("outputs as many lines as there are contacts in contacts.json", function () {
    expect(outputLines).to.have.length(contacts.length);
  });

  it("outputs contacts in the format 'LASTNAME Firstname'", function () {
    expect(outputLines).to.all.match(/^[A-Z]+ [A-Z][a-z]*$/);
  });

  it("outputs all names (first and last) present in contacts.json", function () {
    let allNames = outputLines.join().toLowerCase();
    contacts.forEach(function (contact) {
      expect(allNames).to.contain(contact.firstName.toLowerCase());
      expect(allNames).to.contain(contact.lastName.toLowerCase());
    });
  });

});
