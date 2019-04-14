/* eslint-env mocha */

const path = require('path');
const utils = require('./test-utils');

const originalContacts = require(path.join('..', process.env.npm_package_config_contacts));
const { expect } = utils;

describe('app at step 3', () => {
  describe('add', () => {
    const contacts = {};

    before((done) => {
      utils.diffContactsBeforeAndAfter(
        'add Chuck Norris',
        (diff, before, after, restore) => {
          contacts.added = diff.added;
          contacts.restore = restore;
          done();
        },
        done,
      );
    });

    after((done) => {
      contacts.restore(done);
    });

    it('adds a contact to contacts.json', () => {
      expect(contacts.added).to.have.length(1);
    });

    it('adds a contact with a generated id', () => {
      expect(contacts.added[0]).to.have.property('id');
    });

    it('adds a contact with the first name provided as the first parameter', () => {
      expect(contacts.added[0]).to.have.property('firstName', 'Chuck');
    });

    it('adds a contact with the last name provided as the second parameter', () => {
      expect(contacts.added[0]).to.have.property('lastName', 'Norris');
    });
  });

  describe('remove', () => {
    const idOfTheContactToBeRemoved = originalContacts[0].id;
    const contacts = {};

    before((done) => {
      utils.diffContactsBeforeAndAfter(
        `remove ${idOfTheContactToBeRemoved}`,
        (diff, before, after, restore) => {
          contacts.removed = diff.removed;
          contacts.restore = restore;
          done();
        },
        done,
      );
    });

    after((done) => {
      contacts.restore(done);
    });

    it('removes a contact from contacts.json', () => {
      expect(contacts.removed).to.have.length(1);
    });

    it('removes the contact with the id provided as the first parameter', () => {
      expect(contacts.removed[0]).to.have.property('id', idOfTheContactToBeRemoved);
    });
  });
});
