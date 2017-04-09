// see https://github.com/benmosher/eslint-plugin-import/issues/502
// eslint-disable-next-line import/newline-after-import
const _ = require('lodash');
const contacts = require(process.env.npm_package_config_contacts);

function getAll(callback) {
  callback(null, _.cloneDeep(contacts)); // prevents modification from the outside
}

function get(id, callback) {
  callback(null, _.find(contacts, { id }));
}

function add(contact, callback) {
  const contactCopy = _.cloneDeep(contact); // prevents modification of the caller's object
  contactCopy.id = contacts.length;
  contacts.push(contact);
  callback(null, contact.id);
}

function remove(id, callback) {
  const index = _.findIndex(contacts, { id });
  if (index >= 0) {
    contacts.splice(index, 1);
    callback(null, true);
  } else {
    callback(null, false);
  }
}

module.exports = {
  getAll,
  get,
  add,
  remove,
};
