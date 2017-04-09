const request = require('request');

const port = process.env.npm_package_config_port;
const url = `http://localhost:${port}`;

function getAll(callback) {
  request(
    {
      method: 'GET',
      url: `${url}/contacts`,
    },
    (err, response, body) => {
      if (err) callback(err);
      else callback(body);
    });
}

function get(id, callback) {
  request(
    {
      method: 'GET',
      url: `${url}/contacts/${id}`,
    },
    (err, response, body) => {
      if (err) callback(err);
      else callback(body);
    });
}

function add(contact, callback) {
  request(
    {
      method: 'POST',
      url: `${url}/contacts`,
      body: contact,
      json: Boolean(contact),
    },
    (err) => {
      if (err) callback(err);
      else callback(null);
    });
}

function remove(id, callback) {
  request(
    {
      method: 'DELETE',
      url: `${url}/contacts/${id}`,
    },
    (err) => {
      if (err) callback(err);
      else callback(null);
    });
}

module.exports = {
  getAll,
  get,
  add,
  remove,
};
