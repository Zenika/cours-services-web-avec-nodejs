/* eslint-env mocha */
"use strict";

const utils = require("./test-utils");
const expect = utils.expect;

describe("app at step 3", function () {

  describe("add", function () {

    const contacts = {};

    before(function (done) {
      utils.diffContactsBeforeAndAfter("add Chuck Norris", function (diff, before, after, restore) {
        contacts.added = diff.added;
        contacts.restore = restore;
        done();
      }, done);
    });

    after(function (done) {
      contacts.restore(done);
    });

    it("adds a contact to contacts.json", function () {
      expect(contacts.added).to.have.length(1);
    });

    it("adds a contact with a generated id", function () {
      expect(contacts.added[0]).to.have.property("id");
    });

    it("adds a contact with the first name provided as the first parameter", function () {
      expect(contacts.added[0]).to.have.property("firstName", "Chuck");
    });

    it("adds a contact with the last name provided as the second parameter", function () {
      expect(contacts.added[0]).to.have.property("lastName", "Norris");
    });

  });

  describe("remove", function () {

    const contacts = {};

    before(function (done) {
      utils.diffContactsBeforeAndAfter("remove 3", function (diff, before, after, restore) {
        contacts.removed = diff.removed;
        contacts.restore = restore;
        done();
      }, done);
    });

    after(function (done) {
      contacts.restore(done);
    });

    it("removes a contact from contacts.json", function () {
      expect(contacts.removed).to.have.length(1);
    });

    it("removes the contact with the id provided as the first parameter", function () {
      expect(contacts.removed[0]).to.have.property("id", 3);
    });

  });

});
