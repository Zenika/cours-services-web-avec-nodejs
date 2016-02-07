"use strict";

const _ = require("lodash");
const fs = require("fs");
const shortid = require("shortid");
const contactFile = "./contacts.json"
const read = fs.readFile.bind(null, contactFile);
const write = fs.writeFile.bind(null, contactFile);

module.exports = {
  getAll: getAll,
  get: get,
  add: add,
  remove: remove,
};

function getAll(callback) {
  read(function (readErr, content) {
    if (readErr) return callback(readErr);
    try {
      return callback(null, JSON.parse(content));
    } catch (jsonErr) {
      return callback(jsonErr);
    }
  });
}

function get(id, callback) {
  getAll(function (err, contacts) {
    if (err) return callback(err);
    callback(null, _.find(contacts, {id: id}));
  });
}

function add(contact, callback) {
  contact = _.cloneDeep(contact); // prevents modification of the caller's object
  mutate(function (contacts) {
    contact.id = shortid.generate();
    contacts.push(contact);
    return contact.id;
  }, callback);
}

function remove(id, callback) {
  mutate(function (contacts) {
    return _.remove(contacts, {id: id}).length > 0;
  }, callback);
}

function mutate(mutator, callback) {
  getAll(function (getAllErr, contacts) {
    if (getAllErr) return callback(getAllErr);
    let result = mutator(contacts);
    write(JSON.stringify(contacts), function (writeErr) {
      if (writeErr) return callback(writeErr);
      callback(null, result);
    });
  });
}
