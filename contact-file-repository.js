const _ = require('lodash');
const fs = require('fs');
const shortid = require('shortid');

const contactFile = './contacts.json';
const read = fs.readFile.bind(null, contactFile);
const write = fs.writeFile.bind(null, contactFile);

function getAll(callback) {
  read((readErr, content) => {
    if (readErr) return callback(readErr);
    try {
      return callback(null, JSON.parse(content));
    } catch (jsonErr) {
      return callback(jsonErr);
    }
  });
}

function get(id, callback) {
  getAll((err, contacts) => {
    if (err) callback(err);
    else callback(null, _.find(contacts, { id }));
  });
}

function mutate(mutator, callback) {
  getAll((getAllErr, contacts) => {
    if (getAllErr) {
      callback(getAllErr);
    } else {
      const result = mutator(contacts);
      write(JSON.stringify(contacts), (writeErr) => {
        if (writeErr) callback(writeErr);
        else callback(null, result);
      });
    }
  });
}

function add(contact, callback) {
  const contactCopy = _.cloneDeep(contact); // prevents modification of the caller's object
  mutate((contacts) => {
    contactCopy.id = shortid.generate();
    contacts.push(contactCopy);
    return contactCopy.id;
  }, callback);
}

function remove(id, callback) {
  mutate((contacts) => _.remove(contacts, { id }).length > 0, callback);
}

module.exports = {
  getAll,
  get,
  add,
  remove,
};
