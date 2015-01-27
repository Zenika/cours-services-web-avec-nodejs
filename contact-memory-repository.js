"use strict";

const _ = require("lodash");
const contacts = require(process.env.npm_package_config_contacts);

module.exports = {
  getAll: getAll,
  get: get,
  add: add,
  remove: remove,
};

function getAll(callback) {
  callback(null, _.cloneDeep(contacts)); // prevents modification from the outside
}

function get(id, callback) {
  callback(null, _.find(contacts, {id: id}));
}

function add(contact, callback) {
  contact = _.cloneDeep(contact); // prevents modification of the caller's object
  contact.id = contacts.length;
  contacts.push(contact);
  callback(null, contact.id);
}

function remove(id, callback) {
  let index = _.findIndex(contacts, {id: id});
  if (index < 0) return callback(null, false);
  contacts.splice(index, 1);
  callback(null, true);
}
