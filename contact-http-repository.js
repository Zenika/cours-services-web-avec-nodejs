"use strict";

const request = require("request");

const port = process.env.npm_package_config_port;
const url = `http://localhost:${port}`;

module.exports = {getAll: getAll, get: get, add: add, remove: remove};

function getAll(callback) {
  request(
    {
      method: "GET",
      url: `${url}/contacts`
    },
    function (err, response, body) {
      if (err) return callback(err);
      callback(body);
    });
}

function get(id, callback) {
  request(
    {
      method: "GET",
      url: `${url}/contacts/${id}`
    },
    function (err, response, body) {
      if (err) return callback(err);
      callback(body);
    });
}

function add(contact, callback) {
  request(
    {
      method: "POST",
      url: `${url}/contacts`,
      body: contact,
      json: Boolean(contact)
    },
    function (err) {
      if (err) return callback(err);
      callback(null);
    });
}

function remove(id, callback) {
  request(
    {
      method: "DELETE",
      url: `${url}/contacts/${id}`
    },
    function (err) {
      if (err) return callback(err);
      callback(null);
    });
}