"use strict";

const utils = require("./test-utils");
const expect = utils.expect;
const express = require("express")


describe("app at step 5", function () {

  describe("add", function () {

    it("calls POST /contacts", function (done) {
      let called = false
      const server = express().post("/contacts", function (req, res) {
        called = true
        res.status(200).end()
      }).listen(3232, function () {
        utils.runApp("-- --http add Clark Kent", function () {
          server.close();
          expect(called).to.equal(true);
          done();
        }, err => {throw err});
      })
    });

  });

  describe("remove <id>", function () {

    it("calls DELETE /contacts/<id>", function (done) {
      const id = "id"
      let called = false
      const server = express().delete("/contacts/id", function (req, res) {
        called = true
        res.status(200).end()
      }).listen(3232, function () {
        utils.runApp("-- --http remove id", function () {
          server.close()
          expect(called).to.equal(true);
          done();
        }, err => {throw err});
      })
    });

  });

});